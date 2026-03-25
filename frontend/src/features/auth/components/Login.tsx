import React, { useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { Button } from '../../../components/base/Button';
import { Input } from '../../../components/base/Input';
import { Link, useNavigate } from '@tanstack/react-router';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    login.mutate({ email, password }, {
      onSuccess: () => navigate({ to: '/', replace: true }),
      onError: (err: any) => setError(err?.response?.data?.message || err.message || 'Login failed. Check your credentials.')
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm border border-border rounded-md p-8 bg-white shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">to your E-Commerce account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="w-full" isLoading={login.isPending}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-foreground font-medium hover:underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
