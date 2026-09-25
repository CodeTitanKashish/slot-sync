import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  Filter,
  Users,
  Compass
} from 'lucide-react';
import { Subject, Professor } from '../../types';

interface StudentHomeProps {
  onOpenBookings: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onOpenBookings }) => {
  const { 
    professors, 
    bookings, 
    student, 
    setSelectedProfForBooking,
    setActiveModal 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);

  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Electronics', 'Mechanical'];

  // Filter professors
  const filteredProfessors = useMemo(() => {
    return professors.filter(prof => {
      const matchesSearch = 
        prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prof.roomLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = selectedDepartment === 'All' || prof.department === selectedDepartment;
      const matchesAvailability = !onlyAvailableToday || prof.availableSlotsCount > 0;

      return matchesSearch && matchesDept && matchesAvailability;
    });
  }, [professors, searchQuery, selectedDepartment, onlyAvailableToday]);

  // Find next upcoming confirmed booking for student
  const nextBooking = bookings.find(
    b => b.studentId === student.id && (b.status === 'confirmed' || b.status === 'pending_approval')
  );

  return (
    <div className="space-y-6">
      
      {/* Active Session Reminder Banner if any */}
      {nextBooking && (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                  Upcoming Doubt Session
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  nextBooking.status === 'confirmed' 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}>
                  {nextBooking.status === 'confirmed' ? 'Confirmed by Faculty' : 'Pending Faculty Review'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {nextBooking.professorName} ({nextBooking.subject})
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
                <span className="font-semibold tabular-nums">{nextBooking.time}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{nextBooking.date}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-medium text-teal-700 dark:text-teal-300">
                  <MapPin className="w-3.5 h-3.5" />
                  {nextBooking.professorRoom}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenBookings}
            className="sm:self-center px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 hover:bg-teal-100/50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap self-start"
          >
            <span>View Session & Check-in</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Welcome & Quick Stats */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
            First-Year Academic Mentorship
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Book 1-on-1 Doubt Clearing Slots
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-xl">
            Choose duration (5, 15, or 30 min), describe your question, and reserve office hours with engineering faculty without standing in hallway queues.
          </p>
        </div>

        {/* Student Trust Card */}
        <div 
          onClick={() => setActiveModal('trust_rules')}
          className="cursor-pointer p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-teal-400 transition-all shrink-0 min-w-[240px]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Student Trust Standing
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {student.trustScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 ml-auto">
              {student.tier}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            0 No-shows registered · Full priority booking rights
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty name, subject (e.g. Algorithms, Calculus, Physics), or office room..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          {/* Availability Toggle */}
          <button
            onClick={() => setOnlyAvailableToday(!onlyAvailableToday)}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-2 shrink-0 ${
              onlyAvailableToday
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Open Slots Today</span>
          </button>
        </div>

        {/* Department Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium pl-1 pr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Department:</span>
          </span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedDepartment === dept
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs font-semibold'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Professor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProfessors.map(prof => (
          <div
            key={prof.id}
            className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-4">
              
              {/* Professor Header Info */}
              <div className="flex items-start gap-3.5">
                <img
                  src={prof.avatar}
                  alt={prof.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {prof.department}
                    </span>
                    {prof.isOnlineInCabin && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        In Cabin
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                    {prof.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {prof.title}
                  </p>
                </div>
              </div>

              {/* Subject Tags as clean unboxed text with separators per design constitution */}
              <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-1.5 pt-1">
                {prof.subjects.map((sub, i) => (
                  <React.Fragment key={sub}>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{sub}</span>
                    {i < prof.subjects.length - 1 && <span className="text-slate-300 dark:text-slate-600">·</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {prof.bio}
              </p>

              {/* Metrics & Room location row */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-xs">
                
                {/* Faculty Room Location (Dynamic editable field) */}
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Office / Room:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {prof.roomLocation}
                  </span>
                </div>

                {/* Office Hours */}
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hours:</span>
                  </span>
                  <span className="truncate max-w-[190px] text-right font-medium">
                    {prof.officeHours}
                  </span>
                </div>

                {/* Rating & Doubts cleared */}
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pt-0.5">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{prof.rating}</span>
                  </div>
                  <span className="tabular-nums">
                    {prof.totalDoubtsCleared} doubts cleared ({prof.avgResolutionMinutes}m avg)
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Card Action */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                {prof.availableSlotsCount > 0 ? (
                  <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                    ● {prof.availableSlotsCount} slots open
                  </span>
                ) : (
                  <span className="text-slate-600 dark:text-slate-300">
                    Waitlist only
                  </span>
                )}
              </span>

              <button
                onClick={() => setSelectedProfForBooking(prof)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs shadow-teal-600/20 flex items-center gap-1.5 group-hover:translate-x-0.5"
              >
                <span>Book a Slot</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {filteredProfessors.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Faculty Matches Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or reset department filters to view available professors.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('All');
              setOnlyAvailableToday(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
