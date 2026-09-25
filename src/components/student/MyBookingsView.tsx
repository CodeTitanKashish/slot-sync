import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FastForward, 
  CalendarPlus, 
  ShieldCheck, 
  UserCheck, 
  FileText,
  RotateCcw
} from 'lucide-react';
import { BookingStatus } from '../../types';

export const MyBookingsView: React.FC = () => {
  const { 
    bookings, 
    student, 
    cancelBooking, 
    releaseSlotEarly, 
    triggerNoShow,
    showToast,
    setActiveModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [earlyReleaseModalBookingId, setEarlyReleaseModalBookingId] = useState<string | null>(null);
  const [minutesToRelease, setMinutesToRelease] = useState<number>(15);

  const studentBookings = bookings.filter(b => b.studentId === student.id);

  const filteredBookings = studentBookings.filter(b => {
    if (activeTab === 'upcoming') {
      return b.status === 'confirmed' || b.status === 'pending_approval' || b.status === 'in_progress';
    }
    if (activeTab === 'completed') {
      return b.status === 'completed' || b.status === 'released_early';
    }
    return true;
  });

  const handleSimulateCheckIn = (bookingId: string) => {
    showToast({
      type: 'success',
      title: 'Checked-in Successfully',
      message: 'Faculty has been notified that you are waiting outside the office.'
    });
  };

  const handleConfirmEarlyRelease = () => {
    if (!earlyReleaseModalBookingId) return;
    releaseSlotEarly(earlyReleaseModalBookingId, minutesToRelease);
    setEarlyReleaseModalBookingId(null);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'pending_approval':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Pending Faculty Review
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Completed
          </span>
        );
      case 'released_early':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
            <FastForward className="w-3.5 h-3.5" />
            Released Early ⚡
          </span>
        );
      case 'auto_cancelled':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            Absent (Penalty Applied)
          </span>
        );
      case 'cancelled_by_student':
        return (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Doubt Bookings
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Manage your scheduled professor slots, check room navigation, and release early when finished.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Upcoming Active
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'completed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Past Sessions
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Bookings ({studentBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map(b => (
          <div
            key={b.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs space-y-4"
          >
            {/* Top row: Prof Name & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {b.subject}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {b.professorName}
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                {getStatusBadge(b.status)}
              </div>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Date</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {b.date}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Time</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {b.time} ({b.durationMinutes}m)
                </span>
              </div>

              {/* Professor Room Location - Automatically reflects edits! */}
              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Room Location</span>
                </span>
                <span className="font-bold text-teal-700 dark:text-teal-300">
                  {b.professorRoom}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Doubt Topic</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white truncate block">
                  {b.category}
                </span>
              </div>
            </div>

            {/* Question detail */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                Doubt Detail:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {b.doubtDescription}
              </p>
              {b.facultyNotes && (
                <p className="mt-1.5 text-amber-700 dark:text-amber-300 font-medium">
                  Faculty Note: {b.facultyNotes}
                </p>
              )}
            </div>

            {/* Interactive Actions for Active Bookings */}
            {(b.status === 'confirmed' || b.status === 'pending_approval') && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateCheckIn(b.id)}
                    className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Check-in at Cabin</span>
                  </button>

                  {/* Real-time slot releasing feature */}
                  <button
                    onClick={() => {
                      setEarlyReleaseModalBookingId(b.id);
                      setMinutesToRelease(Math.max(5, b.durationMinutes - 5));
                    }}
                    className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80 text-xs font-bold rounded-xl hover:bg-teal-100/70 transition-colors flex items-center gap-1.5"
                    title="Doubt cleared early? Release remaining time to waitlisted peers!"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Finished Early? Release Slot</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Simulate No-show testing button to demonstrate auto-cancellation */}
                  <button
                    onClick={() => triggerNoShow(b.id)}
                    className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-medium"
                    title="Simulate 5-minute absence grace period expiry"
                  >
                    Simulate No-Show (Auto-cancel)
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    onClick={() => cancelBooking(b.id, 'Cancelled with student notice')}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Bookings in this Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select a faculty member from the directory to schedule your doubt slot.
            </p>
          </div>
        )}
      </div>

      {/* Early Release Modal */}
      {earlyReleaseModalBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 text-teal-600 dark:text-teal-400">
              <FastForward className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Release Unused Minutes to Waitlist
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If your academic question was resolved quickly, release the remaining minutes of your reserved slot. SlotSync will instantly notify waitlisted peers outside the cabin.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Minutes to release back to campus pool:
              </label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinutesToRelease(m)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors ${
                      minutesToRelease === m
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setEarlyReleaseModalBookingId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Keep Full Slot
              </button>
              <button
                onClick={handleConfirmEarlyRelease}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Release & Notify Waitlist
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
