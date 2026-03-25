import { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Navigate, Outlet } from '@tanstack/react-router';

// We'll write the actual router config in src/routes.tsx later
// For now, this is a standard wrapper component for protected routes
export const ProtectedLayout = ({ children, requireAdmin = false }: { children: ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar will go here */}
      <main className="container mx-auto p-4 flex-1">
        {children || <Outlet />}
      </main>
    </div>
  );
};
