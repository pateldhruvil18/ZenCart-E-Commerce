import React, { useState } from 'react';
import { Button } from '../../../components/base/Button';
import { Input } from '../../../components/base/Input';
import { Link, useNavigate } from '@tanstack/react-router';
import { axiosInstance } from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setStep(2);
      toast.success('Reset OTP sent to your email');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axiosInstance.post('/auth/reset-password', { email, otp, password });
      toast.success('Password reset successfully! Please login.');
      navigate({ to: '/login' });
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm border border-border rounded-md p-8 bg-white shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1 font-bold tracking-widest uppercase">
            {step === 1 ? 'Enter your account email' : 'Enter your OTP and new password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" className="w-full font-black uppercase tracking-widest text-[10px] h-11 rounded-1-xl" isLoading={isLoading}>
              Send Reset OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="6-Digit OTP"
              type="text"
              placeholder="123456"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full font-black uppercase tracking-widest text-[10px] h-11 rounded-1-xl mt-4" isLoading={isLoading}>
              Reset & Login
            </Button>

            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full mt-4 text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:underline underline-offset-4"
            >
              Back to Email
            </button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-[10px] font-bold tracking-widest uppercase text-muted-foreground mt-6">
            Remembered it?{' '}
            <Link to="/login" className="text-black hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};
