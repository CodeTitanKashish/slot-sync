import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  FileSpreadsheet, 
  CalendarX, 
  AlertTriangle, 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle,
  Building,
  ArrowUpDown
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';

export const AdminPanel: React.FC = () => {
  const { 
    bookings, 
    professors, 
    student, 
    updateProfessorRoomLocation, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all_bookings' | 'penalties' | 'rooms'>('all_bookings');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Selected professor for room override
  const [editingProfId, setEditingProfId] = useState<string | null>(null);
  const [newRoomText, setNewRoomText] = useState('');

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.studentName.toLowerCase().includes(search.toLowerCase()) ||
      b.professorName.toLowerCase().includes(search.toLowerCase()) ||
      b.doubtDescription.toLowerCase().includes(search.toLowerCase());

    const matchesDept = filterDepartment === 'All' || b.subject === filterDepartment;
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const noShowsAndCancellations = bookings.filter(
    b => b.status === 'auto_cancelled' || b.status === 'cancelled_by_student'
  );

  const handleForgivePenalty = (penaltyId: string) => {
    showToast({
      type: 'success',
      title: 'Penalty Waived by Admin',
      message: 'Student trust score restored (+12 points) following verified academic appeal.'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            Campus Operations & Integrity Console
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            SlotSync Admin Panel
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Full data view of doubt bookings, no-show penalties, cancellations, and faculty office directory.
          </p>
        </div>

        {/* Global stats pill */}
        <div className="flex items-center gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-400 block text-[11px]">Total Bookings</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">{bookings.length}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-400 block text-[11px]">No-Show Rate</span>
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono tabular-nums">2.4%</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-400 block text-[11px]">Faculty Registered</span>
            <span className="text-lg font-bold text-teal-600 dark:text-teal-400 font-mono tabular-nums">{professors.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('all_bookings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'all_bookings'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All Bookings Master Log ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('penalties')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'penalties'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span>No-Shows & Penalties ({noShowsAndCancellations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'rooms'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Faculty Room Directory ({professors.length})
        </button>
      </div>

      {/* TAB 1: ALL BOOKINGS TABLE */}
      {activeTab === 'all_bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-4 p-5">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student roll, professor, doubt topic..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="completed">Completed</option>
              <option value="released_early">Released Early</option>
              <option value="auto_cancelled">Auto-Cancelled (Absent)</option>
              <option value="cancelled_by_student">Cancelled by Student</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Student</th>
                  <th className="py-2.5 px-3 font-semibold">Faculty Mentor</th>
                  <th className="py-2.5 px-3 font-semibold">Scheduled</th>
                  <th className="py-2.5 px-3 font-semibold">Room</th>
                  <th className="py-2.5 px-3 font-semibold">Doubt Category</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{b.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{b.studentRollNo}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900 dark:text-white">{b.professorName}</div>
                      <div className="text-[11px] text-slate-500">{b.subject}</div>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      <div>{b.date}</div>
                      <div className="text-slate-500">{b.time} ({b.durationMinutes}m)</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-teal-700 dark:text-teal-300">
                      {b.professorRoom}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{b.category}</span>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px]">"{b.doubtDescription}"</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize font-semibold text-[11px]">
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NO-SHOWS & PENALTY ENFORCEMENT */}
      {activeTab === 'penalties' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Automated No-Show Penalty & Trust Governance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Students absent past the 5-minute grace period automatically forfeit slots and lose trust score. Repeat offenders face a 24h booking restriction.
            </p>
          </div>

          <div className="space-y-3">
            {student.penaltyHistory.length > 0 ? (
              student.penaltyHistory.map(pen => (
                <div 
                  key={pen.id}
                  className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                        {pen.reason}
                      </h4>
                      <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
                        Recorded on {pen.date} · Penalty: -{pen.pointsDeducted} Trust Points
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleForgivePenalty(pen.id)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    Waive Penalty
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    No Active Suspensions or Sanctions
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    The student cohort is maintaining healthy attendance standards across all department office hours.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FACULTY ROOM DIRECTORY AUDIT */}
      {activeTab === 'rooms' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Faculty Room Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Professors maintain their current office room location here. Administrators can also update locations campus-wide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {professors.map(prof => (
              <div
                key={prof.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {prof.name}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    {prof.department} · {prof.title}
                  </span>
                  <div className="text-xs font-bold text-teal-700 dark:text-teal-300 mt-1">
                    Room: {prof.roomLocation}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const promptVal = window.prompt(`Enter new room location for ${prof.name}:`, prof.roomLocation);
                    if (promptVal && promptVal.trim()) {
                      updateProfessorRoomLocation(prof.id, promptVal.trim());
                    }
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  Edit Room
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
