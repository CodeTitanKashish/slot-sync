import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Calendar, 
  BookOpen, 
  Check, 
  ExternalLink, 
  Copy, 
  RefreshCw 
} from 'lucide-react';

export const LmsSyncModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    showToast 
  } = useApp();

  const [isMoodleConnected, setIsMoodleConnected] = useState(true);
  const [isGoogleCalSynced, setIsGoogleCalSynced] = useState(true);
  const [isCanvasConnected, setIsCanvasConnected] = useState(false);

  if (activeModal !== 'lms_sync') return null;

  const handleCopyFeed = () => {
    navigator.clipboard.writeText('https://slotsync.campus.edu/feed/ical/aarav-26cse042.ics');
    showToast({
      type: 'success',
      title: 'Calendar Feed Copied',
      message: 'iCal subscription URL copied to clipboard.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Calendar & LMS Integration
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronize professor slots with academic timetable
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          
          {/* Moodle LMS */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center font-bold">
                M
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  University Moodle LMS
                </h4>
                <p className="text-slate-500 mt-0.5">
                  Synced: CS 101, MATH 104, PHY 102
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsMoodleConnected(!isMoodleConnected);
                showToast({
                  type: isMoodleConnected ? 'info' : 'success',
                  title: isMoodleConnected ? 'Moodle Disconnected' : 'Moodle Re-synced',
                  message: isMoodleConnected ? 'Course doubt links disabled.' : 'Course assignments mapped.'
                });
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                isMoodleConnected
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              {isMoodleConnected ? 'Connected' : 'Connect'}
            </button>
          </div>

          {/* Google Calendar */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                G
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Google Calendar Two-Way Sync
                </h4>
                <p className="text-slate-500 mt-0.5">
                  Auto-creates calendar invites with faculty room location
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsGoogleCalSynced(!isGoogleCalSynced);
                showToast({
                  type: 'info',
                  title: 'Google Calendar Sync',
                  message: !isGoogleCalSynced ? 'Enabled real-time calendar updates.' : 'Google Calendar sync paused.'
                });
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                isGoogleCalSynced
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              {isGoogleCalSynced ? 'Active' : 'Enable'}
            </button>
          </div>

          {/* Canvas LMS */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold">
                C
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Instructure Canvas LMS
                </h4>
                <p className="text-slate-500 mt-0.5">
                  Lab tutorial assignment doubt links
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCanvasConnected(!isCanvasConnected);
                showToast({
                  type: 'success',
                  title: 'Canvas LMS Connected',
                  message: 'Enrolled coursework synchronized.'
                });
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                isCanvasConnected
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              {isCanvasConnected ? 'Connected' : 'Connect'}
            </button>
          </div>

          {/* iCal Subscription Link */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Personal Timetable Subscription URL:
              </span>
              <button
                onClick={handleCopyFeed}
                className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Feed</span>
              </button>
            </div>
            <code className="text-[11px] font-mono text-slate-500 truncate block">
              https://slotsync.campus.edu/feed/ical/aarav-26cse042.ics
            </code>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveModal('none')}
              className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
