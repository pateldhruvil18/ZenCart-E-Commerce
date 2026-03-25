import React, { useState } from 'react';
import { useRegister } from '../hooks/useAuth';
import { VerifyOTP } from './VerifyOTP';
import { Button } from '../../../components/base/Button';
import { Input } from '../../../components/base/Input';
import { Link } from '@tanstack/react-router';

export const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const register = useRegister();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    register.mutate(formData, {
      onSuccess: () => {
        setRegisteredEmail(formData.email);
      },
      onError: (err: any) =>
        setError(err?.response?.data?.message || err.message || 'Registration failed'),
    });
  };

  // Once registered, show OTP verification step
  if (registeredEmail) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
        <VerifyOTP email={registeredEmail} onBack={() => setRegisteredEmail('')} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm border border-border rounded-md p-8 bg-white shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join E-Commerce Store today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange('email')}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            hint="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange('password')}
          />

          <Button type="submit" className="w-full mt-2" isLoading={register.isPending}>
            Send OTP & Continue
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground font-medium hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
