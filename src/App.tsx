/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StudentHome } from './components/student/StudentHome';
import { MyBookingsView } from './components/student/MyBookingsView';
import { SlotBookingModal } from './components/student/SlotBookingModal';
import { BookingConfirmationModal } from './components/student/BookingConfirmationModal';
import { ProfessorDashboard } from './components/professor/ProfessorDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/auth/AuthModal';
import { WaitlistModal } from './components/features/WaitlistModal';
import { TrustScoreModal } from './components/features/TrustScoreModal';
import { LmsSyncModal } from './components/features/LmsSyncModal';
import { ToastContainer } from './components/common/ToastContainer';
import { 
  CalendarClock, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle 
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRole, setActiveModal } = useApp();
  const [currentTab, setCurrentTab] = useState<'faculty' | 'bookings' | 'analytics' | 'admin'>('faculty');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-teal-500/20 selection:text-teal-700">
      
      {/* Top Bar Header with Light/Dark Mode Switch */}
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Student Views */}
        {currentRole === 'student' && (
          <>
            {currentTab === 'faculty' && (
              <StudentHome onOpenBookings={() => setCurrentTab('bookings')} />
            )}
            {currentTab === 'bookings' && (
              <MyBookingsView />
            )}
          </>
        )}

        {/* Professor Views */}
        {currentRole === 'professor' && (
          <>
            {currentTab === 'faculty' && (
              <ProfessorDashboard />
            )}
            {currentTab === 'bookings' && (
              <MyBookingsView />
            )}
          </>
        )}

        {/* Admin View */}
        {currentRole === 'admin' && (
          <AdminPanel />
        )}

      </main>

      {/* Campus Footer with anti-slop quiet layout */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">SlotSync</span>
            <span>· Academic Mentorship Platform for First-Year Engineers</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveModal('trust_rules')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Attendance & No-Show Policies
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveModal('lms_sync')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Moodle & LMS Integration
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveModal('auth')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              OTP Verification Test
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <SlotBookingModal />
      <BookingConfirmationModal />
      <AuthModal />
      <WaitlistModal />
      <TrustScoreModal />
      <LmsSyncModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
