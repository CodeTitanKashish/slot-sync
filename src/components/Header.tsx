import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  UserCircle2, 
  CalendarClock, 
  Bell, 
  ShieldCheck, 
  GraduationCap, 
  ChevronDown,
  Sparkles,
  LogOut,
  LogIn
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: 'faculty' | 'bookings' | 'analytics' | 'admin';
  setCurrentTab: (tab: 'faculty' | 'bookings' | 'analytics' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { 
    theme, 
    toggleTheme, 
    currentRole, 
    setCurrentRole, 
    student, 
    waitlist, 
    setActiveModal,
    isAuthenticated,
    setIsAuthenticated
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'admin') {
      setCurrentTab('admin');
    } else if (role === 'professor') {
      setCurrentTab('faculty');
    } else {
      setCurrentTab('faculty');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentTab('faculty')} 
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <CalendarClock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              SlotSync
            </span>
          </button>

          {/* Quiet sub-indicator of academic session */}
          <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800">
            Fall Semester Doubt Portal
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {currentRole === 'student' && (
            <>
              <button
                onClick={() => setCurrentTab('faculty')}
                className={`transition-colors pb-1 border-b-2 ${
                  currentTab === 'faculty'
                    ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Find Faculty
              </button>
              <button
                onClick={() => setCurrentTab('bookings')}
                className={`transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                  currentTab === 'bookings'
                    ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>My Bookings</span>
                {student.activeBookingsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setActiveModal('waitlist')}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Bell className="w-4 h-4 text-slate-400" />
                <span>Waitlist Alerts</span>
                {waitlist.length > 0 && (
                  <span className="text-xs text-slate-400 tabular-nums">({waitlist.length})</span>
                )}
              </button>
              <button
                onClick={() => setActiveModal('trust_rules')}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Trust Score: <strong className="text-slate-900 dark:text-white tabular-nums">{student.trustScore}</strong></span>
              </button>
              <button
                onClick={() => setActiveModal('lms_sync')}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                LMS & Calendar
              </button>
            </>
          )}

          {currentRole === 'professor' && (
            <>
              <button
                onClick={() => setCurrentTab('faculty')}
                className={`transition-colors pb-1 border-b-2 ${
                  currentTab === 'faculty'
                    ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Professor Dashboard
              </button>
              <button
                onClick={() => setCurrentTab('bookings')}
                className={`transition-colors pb-1 border-b-2 ${
                  currentTab === 'bookings'
                    ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Doubt History & Queue
              </button>
              <button
                onClick={() => setActiveModal('lms_sync')}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Moodle/Calendar Sync
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => setCurrentTab('admin')}
                className={`transition-colors pb-1 border-b-2 ${
                  currentTab === 'admin'
                    ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Campus Administration
              </button>
              <button
                onClick={() => setActiveModal('trust_rules')}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Penalty Enforcement Policy
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions (Theme toggle, Role Switcher, Auth) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Light / Dark Mode Toggle with smooth switch animation */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-700 hover:text-slate-900 transition-transform duration-200 hover:rotate-12" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 hover:text-amber-300 transition-transform duration-200 hover:rotate-45" />
            )}
          </button>

          {/* Test OTP Flow button */}
          <button
            onClick={() => setActiveModal('auth')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Experience the Post-OTP Verification Flow"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>OTP Flow Demo</span>
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-teal-500/50 transition-colors shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="capitalize font-semibold">{currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsRoleDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-2 divide-y divide-slate-100 dark:divide-slate-700/50">
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Switch Active Persona
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5">
                      Verify workflows across roles
                    </p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => handleRoleSelect('student')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        currentRole === 'student' ? 'text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">Student (Aarav Sharma)</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">1st Year CSE · Roll 26CSE042</div>
                      </div>
                      {currentRole === 'student' && <span className="text-xs">✓</span>}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('professor')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        currentRole === 'professor' ? 'text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">Faculty (Dr. Radhika Sen)</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">Assoc. Professor, Computer Science</div>
                      </div>
                      {currentRole === 'professor' && <span className="text-xs">✓</span>}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        currentRole === 'admin' ? 'text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/30' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-medium">Campus Administrator</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">Dean of Academic Affairs & Policy</div>
                      </div>
                      {currentRole === 'admin' && <span className="text-xs">✓</span>}
                    </button>
                  </div>

                  <div className="pt-1.5 px-2">
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setActiveModal('auth');
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Re-run OTP Verification Screen</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
