export type Subject = 'Computer Science' | 'Mathematics' | 'Physics' | 'Electronics' | 'Mechanical';

export type DoubtCategory = 'Concept Clarification' | 'Assignment / Project' | 'Exam Preparation' | 'Research / Guidance';

export type SlotDuration = 5 | 15 | 30; // minutes

export type BookingStatus = 
  | 'pending_approval'   // Student requested, faculty must confirm
  | 'confirmed'          // Faculty confirmed
  | 'in_progress'        // Slot time started
  | 'completed'          // Session finished
  | 'released_early'     // Finished early, remaining time given to waitlist
  | 'auto_cancelled'     // Student absent, auto-cancelled
  | 'cancelled_by_student';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "10:00 AM"
  timestamp: string; // ISO string
  durationMinutes: SlotDuration;
  isBooked: boolean;
  isAvailable: boolean;
  bookedByStudentId?: string;
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  department: Subject;
  subjects: string[];
  roomLocation: string; // Editable by professor
  officeHours: string;
  avatar: string;
  rating: number;
  totalDoubtsCleared: number;
  avgResolutionMinutes: number;
  isOnlineInCabin: boolean;
  availableSlotsCount: number;
  bio: string;
}

export interface Booking {
  id: string;
  professorId: string;
  professorName: string;
  professorRoom: string;
  subject: Subject;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNo: string;
  date: string; // e.g. "2026-09-25"
  time: string; // e.g. "02:30 PM"
  durationMinutes: SlotDuration;
  category: DoubtCategory;
  doubtDescription: string;
  status: BookingStatus;
  createdAt: string;
  facultyNotes?: string;
  releasedMinutes?: number;
  isLmsSynced?: boolean;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  year: string;
  branch: string;
  trustScore: number; // 0 to 100
  tier: 'Elite (Top Tier)' | 'Standard Standing' | 'Restricted Probation';
  activeBookingsCount: number;
  noShowCount: number;
  penaltyHistory: {
    id: string;
    date: string;
    reason: string;
    pointsDeducted: number;
  }[];
}

export interface WaitlistEntry {
  id: string;
  studentName: string;
  studentEmail: string;
  professorId: string;
  professorName: string;
  requestedDate: string;
  targetDuration: SlotDuration;
  priority: number;
  category: DoubtCategory;
  notifiedAt?: string;
}

export interface ProfessorAnalytics {
  totalSessionsThisMonth: number;
  hoursSavedViaEarlyRelease: number;
  avgDurationMinutes: number;
  completionRate: number; // percentage
  categoryBreakdown: { category: DoubtCategory; percentage: number; count: number }[];
  peakHours: { hour: string; bookingCount: number }[];
}

export type UserRole = 'student' | 'professor' | 'admin';
