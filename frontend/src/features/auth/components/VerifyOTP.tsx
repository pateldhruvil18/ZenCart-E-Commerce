import React, { useState, useEffect } from 'react';
import { useVerifyOTP, useResendOTP } from '../hooks/useAuth';
import { Button } from '../../../components/base/Button';
import { useNavigate } from '@tanstack/react-router';

interface VerifyOTPProps {
  email: string;
  onBack: () => void;
}

export const VerifyOTP: React.FC<VerifyOTPProps> = ({ email, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const verifyOTP = useVerifyOTP();
  const resendOTP = useResendOTP();
  const navigate = useNavigate();

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    setError('');
    verifyOTP.mutate(
      { email, otp: otpString },
      {
        onSuccess: () => navigate({ to: '/' }),
        onError: (err: any) =>
          setError(err?.response?.data?.message || 'Invalid OTP. Please try again.'),
      }
    );
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    resendOTP.mutate(
      { email },
      {
        onSuccess: () => setResendCountdown(60),
        onError: (err: any) => setError(err?.response?.data?.message || 'Failed to resend OTP'),
      }
    );
  };

  return (
    <div className="w-full max-w-sm border border-border rounded-md p-8 bg-white shadow-sm">
      <button
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-sm text-muted-foreground mt-2">
          We sent a 6-digit OTP to{' '}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Boxes */}
        <div className="flex gap-2 justify-center">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-12 text-center text-lg font-semibold border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        <Button type="submit" className="w-full" isLoading={verifyOTP.isPending}>
          Verify Email
        </Button>
      </form>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        {resendCountdown > 0 ? (
          <span>Resend OTP in {resendCountdown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendOTP.isPending}
            className="text-foreground font-medium hover:underline underline-offset-2 disabled:opacity-50"
          >
            {resendOTP.isPending ? 'Sending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
};
