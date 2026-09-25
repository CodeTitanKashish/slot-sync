import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  Clock, 
  Ban, 
  History 
} from 'lucide-react';

export const TrustScoreModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    student 
  } = useApp();

  if (activeModal !== 'trust_rules') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                SlotSync Trust & Attendance Policy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fair access standards for university faculty office hours
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

        <div className="p-6 space-y-5">
          
          {/* Active Student Score Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Current Trust Score for {student.name}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold font-mono text-emerald-900 dark:text-emerald-100 tabular-nums">
                  {student.trustScore}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400">/ 100 points</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                {student.tier}
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block mt-1">
                Max 3 active concurrent bookings
              </span>
            </div>
          </div>

          {/* Three Tier Governance Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Standing Tiers & Penalties
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    90 – 100: Elite Standing
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Unrestricted booking privileges, priority placement on waitlists, and instant 30-minute slot booking access.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    75 – 89: Standard Standing
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Up to 2 active concurrent bookings. Permitted standard 5 and 15-minute doubt sessions.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 flex items-start gap-3">
                <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-900 dark:text-rose-200">
                    Below 75: Restricted Probation (Repeat Offenders)
                  </div>
                  <p className="text-rose-700 dark:text-rose-400 mt-0.5">
                    Triggered by multiple unexcused no-shows. Enforces a <strong>24-hour booking cooldown</strong> and restricts student to 5-minute emergency slots only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Absence policy */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>5-Minute Grace Period & Auto-Cancel</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If a student is not checked in at the faculty cabin within 5 minutes of slot start time, the system auto-cancels the session, docks 12 trust points, and immediately assigns the slot to the next waitlisted student.
            </p>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl"
          >
            Understood
          </button>

        </div>
      </div>
    </div>
  );
};
