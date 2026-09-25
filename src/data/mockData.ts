import { Professor, Student, Booking, WaitlistEntry, ProfessorAnalytics } from '../types';

export const INITIAL_PROFESSORS: Professor[] = [
  {
    id: 'prof-1',
    name: 'Dr. Radhika Sen',
    title: 'Associate Professor & Faculty Advisor',
    department: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms', 'Design Analysis'],
    roomLocation: 'Block 4, Room 302',
    officeHours: '02:00 PM – 05:00 PM (Mon to Fri)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalDoubtsCleared: 342,
    avgResolutionMinutes: 14,
    isOnlineInCabin: true,
    availableSlotsCount: 4,
    bio: 'Specializing in Algorithmic Optimization and Distributed Systems. Welcomes first-year doubts on tree traversals, recurrence relations, and lab assignments.'
  },
  {
    id: 'prof-2',
    name: 'Prof. Arvind Nambiar',
    title: 'Professor & Department Chair',
    department: 'Mathematics',
    subjects: ['Calculus & Linear Algebra', 'Differential Equations'],
    roomLocation: 'Ramanujan Block, Cabin 108',
    officeHours: '10:00 AM – 01:00 PM (Tue, Thu, Fri)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    totalDoubtsCleared: 489,
    avgResolutionMinutes: 18,
    isOnlineInCabin: true,
    availableSlotsCount: 3,
    bio: 'Head of Applied Mathematics. Dedicated to helping first-year engineers conquer matrix diagonalization, multi-variable calculus, and proof strategies.'
  },
  {
    id: 'prof-3',
    name: 'Dr. Meenakshi Sundaram',
    title: 'Assistant Professor',
    department: 'Physics',
    subjects: ['Engineering Physics', 'Quantum Mechanics & Optics'],
    roomLocation: 'C.V. Raman Hall, Lab Annex 2',
    officeHours: '11:30 AM – 03:30 PM (Mon, Wed, Fri)',
    avatar: 'https://images.unsplash.com/photo-1580894732488-825595304b77?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    totalDoubtsCleared: 275,
    avgResolutionMinutes: 12,
    isOnlineInCabin: false,
    availableSlotsCount: 5,
    bio: 'Research lead in photonics and condensed matter. Office hours open for wave mechanics, polarization proofs, and pre-lab conceptual reviews.'
  },
  {
    id: 'prof-4',
    name: 'Dr. Vikram Malhotra',
    title: 'Associate Professor',
    department: 'Electronics',
    subjects: ['Basic Electrical Engineering', 'Semiconductor Devices'],
    roomLocation: 'Bhabha Tech Wing, Room 415',
    officeHours: '01:00 PM – 04:00 PM (Mon to Thu)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    totalDoubtsCleared: 310,
    avgResolutionMinutes: 15,
    isOnlineInCabin: true,
    availableSlotsCount: 2,
    bio: 'Circuit analysis mentor. Open for doubts on Kirchhoff laws, diode IV characteristics, and laboratory breadboard troubleshooting.'
  },
  {
    id: 'prof-5',
    name: 'Prof. Ananya Roy',
    title: 'Assistant Professor',
    department: 'Computer Science',
    subjects: ['Programming in C/C++', 'Object-Oriented Design'],
    roomLocation: 'Turing Center, Room 112',
    officeHours: '02:30 PM – 05:30 PM (Daily)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    totalDoubtsCleared: 520,
    avgResolutionMinutes: 11,
    isOnlineInCabin: true,
    availableSlotsCount: 6,
    bio: 'Lead instructor for CS 101. Helps students understand memory allocation, pointer arithmetic, struct alignment, and debugging GDB crashes.'
  },
  {
    id: 'prof-6',
    name: 'Dr. Rajeshwar Kulkarni',
    title: 'Senior Faculty Member',
    department: 'Mechanical',
    subjects: ['Engineering Mechanics', 'Thermodynamics'],
    roomLocation: 'Kalam Engineering Block, Room 201',
    officeHours: '09:30 AM – 12:30 PM (Wed to Fri)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.6,
    totalDoubtsCleared: 198,
    avgResolutionMinutes: 20,
    isOnlineInCabin: false,
    availableSlotsCount: 1,
    bio: 'Passionate about free body diagrams, equilibrium conditions, and entropy laws. Bring your tutorial sheets and doubts.'
  }
];

export const INITIAL_STUDENT: Student = {
  id: 'stu-1',
  name: 'Aarav Sharma',
  rollNo: '26CSE042',
  email: 'aarav.sharma.26cse@bmu.edu.in',
  phone: '+91 98765 43210',
  year: '1st Year B.Tech',
  branch: 'Computer Science & Engineering',
  trustScore: 98,
  tier: 'Elite (Top Tier)',
  activeBookingsCount: 1,
  noShowCount: 0,
  penaltyHistory: []
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-101',
    professorId: 'prof-1',
    professorName: 'Dr. Radhika Sen',
    professorRoom: 'Block 4, Room 302',
    subject: 'Computer Science',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma.26cse@bmu.edu.in',
    studentRollNo: '26CSE042',
    date: '2026-09-25',
    time: '02:30 PM',
    durationMinutes: 15,
    category: 'Assignment / Project',
    doubtDescription: 'Doubts regarding circular queue array implementation and buffer overflow handling in Assignment 2, problem 3.',
    status: 'confirmed',
    createdAt: '2026-09-24T14:20:00Z',
    facultyNotes: 'Bring your printed test case output.',
    isLmsSynced: true
  },
  {
    id: 'book-102',
    professorId: 'prof-2',
    professorName: 'Prof. Arvind Nambiar',
    professorRoom: 'Ramanujan Block, Cabin 108',
    subject: 'Mathematics',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma.26cse@bmu.edu.in',
    studentRollNo: '26CSE042',
    date: '2026-09-26',
    time: '11:15 AM',
    durationMinutes: 30,
    category: 'Concept Clarification',
    doubtDescription: 'Understanding the geometric intuition of Eigenvalues and Eigenvectors in 3D transformation matrices.',
    status: 'pending_approval',
    createdAt: '2026-09-25T08:15:00Z',
    isLmsSynced: false
  },
  {
    id: 'book-103',
    professorId: 'prof-1',
    professorName: 'Dr. Radhika Sen',
    professorRoom: 'Block 4, Room 302',
    subject: 'Computer Science',
    studentId: 'stu-2',
    studentName: 'Priya Verma',
    studentEmail: 'priya.v.26cse@bmu.edu.in',
    studentRollNo: '26CSE088',
    date: '2026-09-25',
    time: '03:00 PM',
    durationMinutes: 15,
    category: 'Concept Clarification',
    doubtDescription: 'Recursion tree method for solving divide-and-conquer master theorem exceptions.',
    status: 'confirmed',
    createdAt: '2026-09-24T18:00:00Z'
  },
  {
    id: 'book-104',
    professorId: 'prof-1',
    professorName: 'Dr. Radhika Sen',
    professorRoom: 'Block 4, Room 302',
    subject: 'Computer Science',
    studentId: 'stu-3',
    studentName: 'Rohan Gupta',
    studentEmail: 'rohan.g.26cse@bmu.edu.in',
    studentRollNo: '26CSE114',
    date: '2026-09-25',
    time: '03:30 PM',
    durationMinutes: 5,
    category: 'Exam Preparation',
    doubtDescription: 'Midterm syllabus question: are red-black tree color invariants included in Question 5?',
    status: 'pending_approval',
    createdAt: '2026-09-25T09:00:00Z'
  }
];

export const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wait-1',
    studentName: 'Tanvi Nair',
    studentEmail: 'tanvi.n.26cse@bmu.edu.in',
    professorId: 'prof-1',
    professorName: 'Dr. Radhika Sen',
    requestedDate: '2026-09-25',
    targetDuration: 15,
    priority: 1,
    category: 'Assignment / Project'
  },
  {
    id: 'wait-2',
    studentName: 'Devansh Joshi',
    studentEmail: 'devansh.j.26cse@bmu.edu.in',
    professorId: 'prof-1',
    professorName: 'Dr. Radhika Sen',
    requestedDate: '2026-09-25',
    targetDuration: 5,
    priority: 2,
    category: 'Concept Clarification'
  }
];

export const INITIAL_ANALYTICS: ProfessorAnalytics = {
  totalSessionsThisMonth: 84,
  hoursSavedViaEarlyRelease: 18.5,
  avgDurationMinutes: 13.8,
  completionRate: 96.2,
  categoryBreakdown: [
    { category: 'Concept Clarification', percentage: 42, count: 35 },
    { category: 'Assignment / Project', percentage: 36, count: 30 },
    { category: 'Exam Preparation', percentage: 16, count: 14 },
    { category: 'Research / Guidance', percentage: 6, count: 5 }
  ],
  peakHours: [
    { hour: '10 AM - 11 AM', bookingCount: 8 },
    { hour: '11 AM - 12 PM', bookingCount: 14 },
    { hour: '02 PM - 03 PM', bookingCount: 28 },
    { hour: '03 PM - 04 PM', bookingCount: 22 },
    { hour: '04 PM - 05 PM', bookingCount: 12 }
  ]
};
