import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Clock, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight,
  BookOpen,
  Check
} from 'lucide-react';
import { SlotDuration, DoubtCategory } from '../../types';

export const SlotBookingModal: React.FC = () => {
  const { 
    selectedProfForBooking, 
    setSelectedProfForBooking, 
    createBooking 
  } = useApp();

  const [duration, setDuration] = useState<SlotDuration>(15);
  const [selectedDate, setSelectedDate] = useState('Today, Sep 25');
  const [selectedTime, setSelectedTime] = useState('02:30 PM');
  const [category, setCategory] = useState<DoubtCategory>('Concept Clarification');
  const [doubtText, setDoubtText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedProfForBooking) return null;

  const prof = selectedProfForBooking;

  // Available dates
  const dates = [
    { label: 'Today, Sep 25', day: 'Today', isAvailable: true },
    { label: 'Tomorrow, Sep 26', day: 'Tomorrow', isAvailable: true },
    { label: 'Monday, Sep 29', day: 'Mon', isAvailable: true }
  ];

  // Available slots based on duration
  const availableSlots: { [key in SlotDuration]: string[] } = {
    5: ['02:00 PM', '02:05 PM', '02:25 PM', '03:15 PM', '03:45 PM', '04:10 PM'],
    15: ['02:15 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
    30: ['02:30 PM', '03:30 PM', '04:30 PM']
  };

  const currentSlots = availableSlots[duration];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createBooking({
        professorId: prof.id,
        date: selectedDate.includes('Today') ? '2026-09-25' : selectedDate.includes('Tomorrow') ? '2026-09-26' : '2026-09-29',
        time: selectedTime,
        durationMinutes: duration,
        category,
        doubtDescription: doubtText.trim()
      });
      setIsSubmitting(false);
      setSelectedProfForBooking(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Reserve Faculty Doubt Slot
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Booking with {prof.name}
            </h3>
          </div>
          <button
            onClick={() => setSelectedProfForBooking(null)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Professor Quick Card & Live Room Location */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={prof.avatar}
                alt={prof.name}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {prof.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{prof.department}</span>
                  <span aria-hidden="true">·</span>
                  <span>Avg {prof.avgResolutionMinutes} min clearance</span>
                </div>
              </div>
            </div>

            {/* Room Location (Students see updated room location here!) */}
            <div className="text-right shrink-0">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Office Location</span>
              </div>
              <div className="text-xs font-bold text-teal-700 dark:text-teal-300 mt-0.5">
                {prof.roomLocation}
              </div>
            </div>
          </div>

          {/* 1. Duration Selector: 5, 15, 30 minutes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Slot Duration</span>
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Choose based on doubt complexity
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { mins: 5 as SlotDuration, title: '5 Mins', note: 'Quick Check / Sign' },
                { mins: 15 as SlotDuration, title: '15 Mins', note: 'Single Doubt / Code' },
                { mins: 30 as SlotDuration, title: '30 Mins', note: 'Concept / Exam Prep' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.mins}
                  onClick={() => {
                    setDuration(opt.mins);
                    // auto select first available slot
                    if (availableSlots[opt.mins][0]) {
                      setSelectedTime(availableSlots[opt.mins][0]);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    duration === opt.mins
                      ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 dark:border-teal-500 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{opt.title}</span>
                    {duration === opt.mins && (
                      <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                    {opt.note}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Date Picker */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Select Date</span>
            </label>
            <div className="flex items-center gap-2">
              {dates.map(d => (
                <button
                  type="button"
                  key={d.label}
                  onClick={() => setSelectedDate(d.label)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-all ${
                    selectedDate === d.label
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs font-semibold'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Time Slot Picker */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Select Start Time ({duration} min duration)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {currentSlots.map(time => (
                <button
                  type="button"
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-2.5 text-xs font-medium rounded-xl border transition-all tabular-nums text-center ${
                    selectedTime === time
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs font-semibold'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Category Dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
              Doubt Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DoubtCategory)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="Concept Clarification">Concept Clarification (Lecture & Theory)</option>
              <option value="Assignment / Project">Assignment / Project (Code & Lab report)</option>
              <option value="Exam Preparation">Exam Preparation (Midterm & Endterm questions)</option>
              <option value="Research / Guidance">Research / Guidance (Course electives & papers)</option>
            </select>
          </div>

          {/* 5. Text Field: "What's your doubt about?" */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                What's your doubt about?
              </label>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {doubtText.length}/300 characters
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={300}
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              placeholder="e.g. In Lecture 7, I am confused about when Dijkstra algorithm fails for graphs with negative weights. Also need a quick review of my Question 3 solution."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/50 resize-none"
            />
          </div>

          {/* Requirement: Faculty must confirm booking (not student) */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Faculty Approval Policy:</strong> The professor will review your doubt description before confirming the slot. You will receive an alert once accepted.
            </p>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedProfForBooking(null)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !doubtText.trim()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-teal-600/20 flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Sending Request...' : 'Submit Slot Request'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
