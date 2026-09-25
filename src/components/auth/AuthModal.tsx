import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Phone, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Sparkles,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    setIsAuthenticated, 
    showToast,
    student 
  } = useApp();

  type Step = 'login_input' | 'otp_verify' | 'otp_success' | 'forgot_password' | 'forgot_verify' | 'new_password';
  const [step, setStep] = useState<Step>('login_input');
  
  // Login input
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('aarav.sharma.26cse@bmu.edu.in');
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9', '1', '0']);
  const [resendTimer, setResendTimer] = useState(30);
  
  // Forgot password
  const [resetEmail, setResetEmail] = useState('aarav.sharma.26cse@bmu.edu.in');
  const [resetCode, setResetCode] = useState('7492');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (activeModal === 'forgot_password') {
      setStep('forgot_password');
    } else if (activeModal === 'auth') {
      setStep('login_input');
    }
  }, [activeModal]);

  // Resend countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp_verify' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (activeModal !== 'auth' && activeModal !== 'forgot_password') return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setResendTimer(30);
    setStep('otp_verify');
    showToast({
      type: 'info',
      title: 'OTP Sent',
      message: `A 6-digit one-time passcode has been dispatched to ${identifier}.`
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otpDigits];
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d;
      });
      setOtpDigits(newOtp);
      return;
    }
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      showToast({
        type: 'warning',
        title: 'Incomplete OTP',
        message: 'Please enter all 6 digits of the OTP.'
      });
      return;
    }

    // Move to Post-OTP Verification Success Screen
    setStep('otp_success');
  };

  // Post-OTP "Next" Transition
  const handleNextToDashboard = () => {
    setIsAuthenticated(true);
    setActiveModal('none');
    showToast({
      type: 'success',
      title: 'Welcome Back, Aarav!',
      message: 'Dashboard loaded. 1 active session scheduled today with Dr. Radhika Sen.'
    });
  };

  // Forgot password flow
  const handleRequestPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setStep('forgot_verify');
    showToast({
      type: 'info',
      title: 'Reset Code Sent',
      message: `Password reset instructions sent to ${resetEmail}.`
    });
  };

  const handleVerifyResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('new_password');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'The new passwords do not match. Please verify.'
      });
      return;
    }
    showToast({
      type: 'success',
      title: 'Password Updated',
      message: 'Your SlotSync password has been updated. Please sign in.'
    });
    setStep('login_input');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveModal('none')}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Container */}
        <div className="p-6 sm:p-8">
          
          {/* Top Brand & Academic Note */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white">SlotSync</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-0.5">Campus Doubt Hub</span>
            </div>
          </div>

          {/* STEP 1: LOGIN / OTP INPUT */}
          {step === 'login_input' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Student & Faculty Sign-In
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
                Enter your university credentials to verify with 2-Factor OTP.
              </p>

              {/* Method Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setIdentifier('aarav.sharma.26cse@bmu.edu.in');
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
                    authMethod === 'email'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  University Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setIdentifier('+91 98765 43210');
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all ${
                    authMethod === 'phone'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Mobile Number
                </button>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {authMethod === 'email' ? 'College Email Address (.edu)' : 'Registered Mobile Number'}
                  </label>
                  <div className="relative">
                    {authMethod === 'email' ? (
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    ) : (
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    )}
                    <input
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      placeholder={authMethod === 'email' ? 'your.name@bmu.edu.in' : '+91 98765 43210'}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    Auto-sends instant campus code
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('forgot_password')}
                    className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-teal-600/20 flex items-center justify-center gap-2 mt-4"
                >
                  <span>Generate Verification OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  First-year registration active for Fall Semester · No-show protection enforced
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER OTP CODE */}
          {step === 'otp_verify' && (
            <div>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Two-Factor Authentication</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Enter 6-Digit OTP
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
                Code sent to <strong className="text-slate-800 dark:text-slate-200">{identifier}</strong>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 OTP boxes */}
                <div className="flex items-center justify-between gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-11 h-12 text-center text-lg font-bold font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 tabular-nums"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDigits(['4', '8', '2', '9', '1', '0']);
                      showToast({ type: 'info', title: 'Sample Filled', message: 'Demo OTP 482910 applied.' });
                    }}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                  >
                    Auto-fill demo code (482910)
                  </button>

                  {resendTimer > 0 ? (
                    <span className="text-slate-400 tabular-nums">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResendTimer(30)}
                      className="font-medium text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('login_input')}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-teal-600/20 flex items-center justify-center gap-2"
                  >
                    <span>Verify OTP Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: POST-OTP VERIFICATION SUCCESS SCREEN (USER SPECIFIED) */}
          {step === 'otp_success' && (
            <div className="text-center py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Verification Successful!
              </h2>

              {/* Friendly success message specified in user brief */}
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-2">
                Verification successful! Continue to your dashboard.
              </p>

              <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Authenticated Identity:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Aarav Sharma</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>University Roll:</span>
                  <span className="font-mono text-slate-900 dark:text-white">26CSE042</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Student Trust Standing:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">98/100 (Elite)</span>
                </div>
              </div>

              {/* "Next" button as requested */}
              <button
                onClick={handleNextToDashboard}
                className="w-full py-3 px-5 bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-teal-600/25 flex items-center justify-center gap-2 group"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* FORGOT PASSWORD: STEP 1 - REQUEST RESET */}
          {step === 'forgot_password' && (
            <div>
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-2">
                <KeyRound className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Account Recovery</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Reset Forgotten Password
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
                Enter your university roll email to receive a secure recovery PIN.
              </p>

              <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    University Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      placeholder="aarav.sharma.26cse@bmu.edu.in"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('login_input')}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-teal-600/20 flex items-center justify-center gap-2"
                  >
                    <span>Send Recovery PIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD: STEP 2 - VERIFY RESET CODE */}
          {step === 'forgot_verify' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Verify Recovery PIN
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
                Enter the 4-digit security code sent to {resetEmail}
              </p>

              <form onSubmit={handleVerifyResetCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Recovery PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full text-center tracking-widest text-xl font-mono py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('forgot_password')}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    <span>Proceed to New Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD: STEP 3 - SET NEW PASSWORD */}
          {step === 'new_password' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Create New Password
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-6">
                Ensure it has at least 8 characters with letters and numbers.
              </p>

              <form onSubmit={handleSaveNewPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 mt-4"
                >
                  <span>Save Password & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
