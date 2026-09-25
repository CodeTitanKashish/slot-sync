import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FastForward, 
  Save, 
  Edit3, 
  TrendingUp, 
  BarChart2, 
  Check, 
  Users, 
  GraduationCap,
  CalendarCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';

export const ProfessorDashboard: React.FC = () => {
  const { 
    professors, 
    bookings, 
    analytics, 
    approveBooking, 
    completeBooking, 
    triggerNoShow, 
    releaseSlotEarly, 
    updateProfessorRoomLocation,
    showToast 
  } = useApp();

  // Active professor is Dr. Radhika Sen by default in demo
  const currentProf = professors[0]; // Dr. Radhika Sen

  // Editable room location state
  const [roomInput, setRoomInput] = useState(currentProf.roomLocation);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [officeStatus, setOfficeStatus] = useState<'in_cabin' | 'in_lecture' | 'busy'>('in_cabin');

  // Filter bookings for this professor
  const profBookings = bookings.filter(b => b.professorId === currentProf.id);
  const pendingRequests = profBookings.filter(b => b.status === 'pending_approval');
  const upcomingConfirmed = profBookings.filter(b => b.status === 'confirmed');
  const pastSessions = profBookings.filter(b => b.status === 'completed' || b.status === 'released_early' || b.status === 'auto_cancelled');

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomInput.trim()) return;
    updateProfessorRoomLocation(currentProf.id, roomInput.trim());
    setIsEditingRoom(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Faculty Availability & Room Location Settings Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Profile snippet */}
          <div className="flex items-center gap-4">
            <img
              src={currentProf.avatar}
              alt={currentProf.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Faculty Availability Hub
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">Office Hours Open</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentProf.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentProf.title} · {currentProf.department}
              </p>
            </div>
          </div>

          {/* REQUIREMENT: Faculty Room Location Editing */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 min-w-[320px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Current Room Location</span>
              </span>
              {!isEditingRoom && (
                <button
                  onClick={() => setIsEditingRoom(true)}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Room</span>
                </button>
              )}
            </div>

            {isEditingRoom ? (
              <form onSubmit={handleSaveRoom} className="space-y-2 mt-2">
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    required
                    placeholder="e.g. Block 4, Room 302 or Ramanujan Wing 214"
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-teal-500 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRoomInput(currentProf.roomLocation);
                      setIsEditingRoom(false);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Location</span>
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-sm font-bold text-teal-800 dark:text-teal-200">
                  {currentProf.roomLocation}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Saved & visible on all student booking cards instantly
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Hours Saved (Early Releases)</span>
            <FastForward className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {analytics.hoursSavedViaEarlyRelease} hrs
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Slot minutes recycled to waitlist
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Doubts Cleared This Month</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {analytics.totalSessionsThisMonth}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across 1st-year CSE cohorts
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Avg Session Duration</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {analytics.avgDurationMinutes} mins
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            High throughput efficiency
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Student Attendance Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">
            {analytics.completionRate}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Protected by trust penalty policy
          </p>
        </div>
      </div>

      {/* Two Column Layout: Pending Faculty Approvals & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Faculty Confirmations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pending Faculty Confirmations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review student doubt brief before accepting slot
              </p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold tabular-nums">
              {pendingRequests.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map(b => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {b.studentName}
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">
                      {b.studentRollNo} · {b.studentEmail}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    {b.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  "{b.doubtDescription}"
                </p>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5 font-semibold tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{b.date} · {b.time} ({b.durationMinutes} min)</span>
                  </div>

                  <button
                    onClick={() => approveBooking(b.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Slot</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No pending student slot requests. All caught up!
              </div>
            )}
          </div>
        </div>

        {/* Confirmed Upcoming Bookings Queue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Doubt Sessions Today
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mark completed or release early when student finishes
              </p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold tabular-nums">
              {upcomingConfirmed.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {upcomingConfirmed.map(b => (
              <div
                key={b.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {b.studentName} ({b.studentRollNo})
                    </h4>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      {b.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums block">
                      {b.time}
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {b.durationMinutes} min reserved
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {b.doubtDescription}
                </p>

                {/* Professor Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-700/60 pt-2.5">
                  <div className="flex items-center gap-2">
                    {/* Mark Completed button */}
                    <button
                      onClick={() => completeBooking(b.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Completed</span>
                    </button>

                    {/* Early release slot button */}
                    <button
                      onClick={() => releaseSlotEarly(b.id, Math.max(5, b.durationMinutes - 5))}
                      className="px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                      title="Doubt resolved early? Release remaining time to waitlist"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>Release Early</span>
                    </button>
                  </div>

                  {/* Student absent button */}
                  <button
                    onClick={() => triggerNoShow(b.id)}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
                  >
                    Absent (Auto-Cancel)
                  </button>
                </div>
              </div>
            ))}

            {upcomingConfirmed.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No active confirmed slots right now.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Analytics Deep Dive: Peak Hours & Common Categories */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Department Doubt Analytics & Trends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Insights to optimize office hours and identify challenging course concepts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Peak Query Hours Bar Chart */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Peak Query Hours (Student Rush Times)</span>
            </h4>
            <div className="space-y-2">
              {analytics.peakHours.map(item => {
                const max = 30;
                const percentage = Math.round((item.bookingCount / max) * 100);
                return (
                  <div key={item.hour} className="text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                      <span>{item.hour}</span>
                      <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                        {item.bookingCount} bookings
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Common Categories Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-teal-600" />
              <span>Common Doubt Categories</span>
            </h4>
            <div className="space-y-2.5">
              {analytics.categoryBreakdown.map(cat => (
                <div key={cat.category} className="text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>{cat.category}</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {cat.count} doubts ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
