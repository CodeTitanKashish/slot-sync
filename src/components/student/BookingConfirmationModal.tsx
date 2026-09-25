import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  FileText, 
  CalendarPlus, 
  Share2, 
  Trash2, 
  Edit3,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { Booking } from '../../types';

export const BookingConfirmationModal: React.FC = () => {
  const { 
    latestConfirmedBooking, 
    setLatestConfirmedBooking, 
    cancelBooking,
    showToast 
  } = useApp();

  const [isEditingDoubt, setIsEditingDoubt] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    latestConfirmedBooking?.doubtDescription || ''
  );

  if (!latestConfirmedBooking) return null;

  const booking = latestConfirmedBooking;

  const handleDownloadIcs = () => {
    // Generate clean .ics calendar file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SlotSync//College Doubt Booking//EN
BEGIN:VEVENT
SUMMARY:Doubt Session with ${booking.professorName}
DESCRIPTION:${booking.doubtDescription}
LOCATION:${booking.professorRoom}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SlotSync-${booking.professorName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Calendar Event Downloaded',
      message: 'iCal event exported. Import into Google Calendar, Apple Calendar, or Outlook.'
    });
  };

  const handleCancel = () => {
    cancelBooking(booking.id, 'Cancelled by student from confirmation view');
    setLatestConfirmedBooking(null);
  };

  const handleSaveEdit = () => {
    booking.doubtDescription = editedDescription;
    setIsEditingDoubt(false);
    showToast({
      type: 'success',
      title: 'Request Details Updated',
      message: 'Professor will receive the updated doubt description.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Booking Request Registered!
              </h3>
              {/* Friendly success message */}
              <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Your request has been queued for faculty review.
              </p>
            </div>
          </div>

          <button
            onClick={() => setLatestConfirmedBooking(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-emerald-100/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Booking Details Card */}
        <div className="p-6 space-y-5">
          
          {/* Card Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            
            {/* Faculty & Subject */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Faculty Mentor
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {booking.professorName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  {booking.subject} Department
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                Awaiting Approval
              </span>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 grid grid-cols-2 gap-3 text-xs">
              {/* Date & Time */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Scheduled Date</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {booking.date}
                </div>
              </div>

              {/* Time & Duration */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Time & Duration</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {booking.time} ({booking.durationMinutes} min)
                </div>
              </div>

              {/* Professor Room Location (updated dynamically) */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Room Location</span>
                </div>
                <div className="font-bold text-teal-700 dark:text-teal-300">
                  {booking.professorRoom}
                </div>
              </div>

              {/* Doubt Category */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Tag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Category</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {booking.category}
                </div>
              </div>
            </div>

            {/* Doubt Description */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Doubt Brief:</span>
                </span>
                {!isEditingDoubt && (
                  <button
                    onClick={() => setIsEditingDoubt(true)}
                    className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit description</span>
                  </button>
                )}
              </div>

              {isEditingDoubt ? (
                <div className="space-y-2 mt-2">
                  <textarea
                    rows={2}
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingDoubt(false)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-teal-600 text-white rounded-md text-xs font-medium"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  "{booking.doubtDescription}"
                </p>
              )}
            </div>

          </div>

          {/* Quick Actions (Add to Calendar, LMS Sync, Cancel) */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadIcs}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <CalendarPlus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <button
              onClick={handleCancel}
              className="py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Cancel Request</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setLatestConfirmedBooking(null)}
              className="w-full py-2.5 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
            >
              Done & Return to Dashboard
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
