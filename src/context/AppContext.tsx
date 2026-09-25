import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Professor, 
  Student, 
  Booking, 
  WaitlistEntry, 
  ProfessorAnalytics, 
  UserRole, 
  SlotDuration, 
  DoubtCategory 
} from '../types';
import { 
  INITIAL_PROFESSORS, 
  INITIAL_STUDENT, 
  INITIAL_BOOKINGS, 
  INITIAL_WAITLIST, 
  INITIAL_ANALYTICS 
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  student: Student;
  professors: Professor[];
  bookings: Booking[];
  waitlist: WaitlistEntry[];
  analytics: ProfessorAnalytics;
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  
  // Faculty room location editing
  updateProfessorRoomLocation: (professorId: string, newLocation: string) => void;
  
  // Booking operations
  createBooking: (data: {
    professorId: string;
    date: string;
    time: string;
    durationMinutes: SlotDuration;
    category: DoubtCategory;
    doubtDescription: string;
  }) => Booking;
  approveBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string, reason?: string) => void;
  
  // Real-time slot releasing
  releaseSlotEarly: (bookingId: string, minutesSaved: number) => void;
  
  // Auto-cancel if absent & penalty
  triggerNoShow: (bookingId: string) => void;
  
  // Waitlist actions
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id'>) => void;
  claimReleasedSlot: (waitlistId: string, slotTime: string) => void;

  // Active modal controls
  activeModal: 'none' | 'auth' | 'forgot_password' | 'lms_sync' | 'trust_rules' | 'waitlist';
  setActiveModal: (modal: 'none' | 'auth' | 'forgot_password' | 'lms_sync' | 'trust_rules' | 'waitlist') => void;
  
  // Selected professor for booking modal
  selectedProfForBooking: Professor | null;
  setSelectedProfForBooking: (prof: Professor | null) => void;
  
  // Selected booking for confirmation or details
  latestConfirmedBooking: Booking | null;
  setLatestConfirmedBooking: (booking: Booking | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: default Light, persisted in localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('slotsync_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [student, setStudent] = useState<Student>(() => {
    const saved = localStorage.getItem('slotsync_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });
  const [professors, setProfessors] = useState<Professor[]>(() => {
    const saved = localStorage.getItem('slotsync_professors');
    return saved ? JSON.parse(saved) : INITIAL_PROFESSORS;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('slotsync_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(INITIAL_WAITLIST);
  const [analytics, setAnalytics] = useState<ProfessorAnalytics>(INITIAL_ANALYTICS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeModal, setActiveModal] = useState<'none' | 'auth' | 'forgot_password' | 'lms_sync' | 'trust_rules' | 'waitlist'>('none');
  const [selectedProfForBooking, setSelectedProfForBooking] = useState<Professor | null>(null);
  const [latestConfirmedBooking, setLatestConfirmedBooking] = useState<Booking | null>(null);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('slotsync_theme', theme);
  }, [theme]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('slotsync_professors', JSON.stringify(professors));
  }, [professors]);

  useEffect(() => {
    localStorage.setItem('slotsync_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('slotsync_student', JSON.stringify(student));
  }, [student]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Faculty room location editing
  const updateProfessorRoomLocation = (professorId: string, newLocation: string) => {
    const trimmed = newLocation.trim();
    if (!trimmed) return;

    setProfessors(prev => prev.map(prof => {
      if (prof.id === professorId) {
        return { ...prof, roomLocation: trimmed };
      }
      return prof;
    }));

    // Update ongoing and future bookings with this professor so students see the updated location!
    setBookings(prev => prev.map(b => {
      if (b.professorId === professorId && b.status !== 'completed' && b.status !== 'auto_cancelled') {
        return { ...b, professorRoom: trimmed };
      }
      return b;
    }));

    showToast({
      type: 'success',
      title: 'Room Location Updated',
      message: `Office location saved as "${trimmed}". Students will now see this updated room when booking slots.`
    });
  };

  // Booking operations
  const createBooking = (data: {
    professorId: string;
    date: string;
    time: string;
    durationMinutes: SlotDuration;
    category: DoubtCategory;
    doubtDescription: string;
  }): Booking => {
    const prof = professors.find(p => p.id === data.professorId);
    const newBooking: Booking = {
      id: 'book-' + Math.random().toString(36).substring(2, 8),
      professorId: data.professorId,
      professorName: prof ? prof.name : 'Faculty Member',
      professorRoom: prof ? prof.roomLocation : 'Faculty Cabin',
      subject: prof ? prof.department : 'Computer Science',
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentRollNo: student.rollNo,
      date: data.date,
      time: data.time,
      durationMinutes: data.durationMinutes,
      category: data.category,
      doubtDescription: data.doubtDescription,
      status: 'pending_approval', // Faculty must confirm booking (not student)
      createdAt: new Date().toISOString(),
      isLmsSynced: true
    };

    setBookings(prev => [newBooking, ...prev]);
    setStudent(prev => ({
      ...prev,
      activeBookingsCount: prev.activeBookingsCount + 1
    }));

    showToast({
      type: 'info',
      title: 'Slot Request Submitted',
      message: `Your booking request for ${data.time} has been sent to ${prof?.name}. Faculty must confirm prior to session.`
    });

    setLatestConfirmedBooking(newBooking);
    return newBooking;
  };

  const approveBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'confirmed' };
      }
      return b;
    }));

    showToast({
      type: 'success',
      title: 'Booking Confirmed',
      message: 'Student has been notified with room navigation and Google Calendar invite.'
    });
  };

  const completeBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'completed' };
      }
      return b;
    }));

    // Reward student trust score slightly for clean completion
    setStudent(prev => ({
      ...prev,
      trustScore: Math.min(100, prev.trustScore + 1)
    }));

    setAnalytics(prev => ({
      ...prev,
      totalSessionsThisMonth: prev.totalSessionsThisMonth + 1
    }));

    showToast({
      type: 'success',
      title: 'Session Marked Completed',
      message: `Doubt session with ${booking?.studentName || 'student'} logged successfully.`
    });
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { 
          ...b, 
          status: 'cancelled_by_student',
          facultyNotes: reason || 'Cancelled by student in advance'
        };
      }
      return b;
    }));

    setStudent(prev => ({
      ...prev,
      activeBookingsCount: Math.max(0, prev.activeBookingsCount - 1)
    }));

    showToast({
      type: 'info',
      title: 'Slot Cancelled',
      message: 'The slot has been released back into the department availability pool.'
    });
  };

  // Real-time slot releasing (students or prof can mark finished early -> opens to waitlisted peers)
  const releaseSlotEarly = (bookingId: string, minutesSaved: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { 
          ...b, 
          status: 'released_early',
          releasedMinutes: minutesSaved
        };
      }
      return b;
    }));

    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      hoursSavedViaEarlyRelease: Number((prev.hoursSavedViaEarlyRelease + (minutesSaved / 60)).toFixed(1)),
      totalSessionsThisMonth: prev.totalSessionsThisMonth + 1
    }));

    // Notify waitlisted peers
    const topWaitlist = waitlist[0];
    if (topWaitlist) {
      showToast({
        type: 'success',
        title: '⚡ Slot Released in Real-Time!',
        message: `${minutesSaved} minutes freed early! Instant alert dispatched to waitlisted student (${topWaitlist.studentName}).`
      });
    } else {
      showToast({
        type: 'success',
        title: 'Slot Released Early',
        message: `${minutesSaved} minutes released back to campus schedule. Thank you for freeing professor time!`
      });
    }
  };

  // Auto-cancel if absent -> slot offered to next person on waitlist & penalty
  const triggerNoShow = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { 
          ...b, 
          status: 'auto_cancelled',
          facultyNotes: 'Auto-cancelled: Student absent past 5-minute grace period.'
        };
      }
      return b;
    }));

    // Deduct trust points from student
    setStudent(prev => {
      const newScore = Math.max(20, prev.trustScore - 12);
      const newTier = newScore >= 90 
        ? 'Elite (Top Tier)' 
        : newScore >= 75 
          ? 'Standard Standing' 
          : 'Restricted Probation';

      return {
        ...prev,
        trustScore: newScore,
        tier: newTier,
        noShowCount: prev.noShowCount + 1,
        activeBookingsCount: Math.max(0, prev.activeBookingsCount - 1),
        penaltyHistory: [
          {
            id: 'pen-' + Date.now(),
            date: new Date().toLocaleDateString(),
            reason: `Absent on ${booking.time} session with ${booking.professorName} without prior notice.`,
            pointsDeducted: 12
          },
          ...prev.penaltyHistory
        ]
      };
    });

    // Offer slot to next person on waitlist
    const nextStudent = waitlist[0];
    if (nextStudent) {
      showToast({
        type: 'error',
        title: '⚠️ Student Absent (No-Show Registered)',
        message: `Auto-cancelled: Slot offered immediately to next waitlisted peer (${nextStudent.studentName}). Student trust score reduced by 12.`
      });
    } else {
      showToast({
        type: 'error',
        title: '⚠️ Student Absent (No-Show Registered)',
        message: 'Auto-cancelled after 5-minute grace period. Penalty applied to student profile.'
      });
    }
  };

  const addToWaitlist = (entry: Omit<WaitlistEntry, 'id'>) => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: 'wait-' + Math.random().toString(36).substring(2, 8)
    };
    setWaitlist(prev => [...prev, newEntry]);
    showToast({
      type: 'info',
      title: 'Joined Priority Waitlist',
      message: `You will receive an instant push notification the second an early release or cancellation occurs with ${entry.professorName}.`
    });
  };

  const claimReleasedSlot = (waitlistId: string, slotTime: string) => {
    const entry = waitlist.find(w => w.id === waitlistId);
    if (!entry) return;

    // Create booking for waitlisted student
    createBooking({
      professorId: entry.professorId,
      date: entry.requestedDate,
      time: slotTime,
      durationMinutes: entry.targetDuration,
      category: entry.category,
      doubtDescription: 'Claimed via instant waitlist alert notification.'
    });

    setWaitlist(prev => prev.filter(w => w.id !== waitlistId));
    setActiveModal('none');

    showToast({
      type: 'success',
      title: 'Waitlist Slot Claimed!',
      message: `Successfully booked newly released slot for ${slotTime}.`
    });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        isAuthenticated,
        setIsAuthenticated,
        student,
        professors,
        bookings,
        waitlist,
        analytics,
        toasts,
        showToast,
        dismissToast,
        updateProfessorRoomLocation,
        createBooking,
        approveBooking,
        completeBooking,
        cancelBooking,
        releaseSlotEarly,
        triggerNoShow,
        addToWaitlist,
        claimReleasedSlot,
        activeModal,
        setActiveModal,
        selectedProfForBooking,
        setSelectedProfForBooking,
        latestConfirmedBooking,
        setLatestConfirmedBooking
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
