import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Bell, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users 
} from 'lucide-react';

export const WaitlistModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    waitlist, 
    claimReleasedSlot,
    showToast 
  } = useApp();

  if (activeModal !== 'waitlist') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live Waitlist & Instant Re-Openings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time slots freed by absent students or early finishes
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-800 dark:text-teal-300">
            <strong>How Real-Time Releasing Works:</strong> When another student finishes their session early, or fails to check in within 5 minutes, their slot is immediately broadcast here for 90 seconds.
          </div>

          {/* Active Waitlist items */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Slots Currently In Demand
            </h4>

            {waitlist.map((entry, idx) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {entry.professorName}
                    </span>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                      Priority #{idx + 1}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Target: {entry.targetDuration} min slot · {entry.category}
                  </div>
                </div>

                <button
                  onClick={() => claimReleasedSlot(entry.id, '03:45 PM')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Claim Now</span>
                </button>
              </div>
            ))}

            {waitlist.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400">
                No active waitlist queues. All faculty slots are moving smoothly.
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
            >
              Close Waitlist
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
