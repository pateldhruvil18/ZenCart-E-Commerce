import { createRouter, createRoute, createRootRoute, redirect, Outlet } from '@tanstack/react-router';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './components/shared/MainLayout';
import { ProtectedLayout } from './components/shared/ProtectedLayout';
import { CartProvider } from './features/cart/components/CartProvider';
import React, { Suspense } from 'react';

// Defer monolithic feature payloads to minimize initial TTI metrics
const ProductListing = React.lazy(() => import('./features/products/components/ProductListing').then(m => ({ default: m.ProductListing })));
const ProductDetail = React.lazy(() => import('./features/products/components/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Login = React.lazy(() => import('./features/auth/components/Login').then(m => ({ default: m.Login })));
const Register = React.lazy(() => import('./features/auth/components/Register').then(m => ({ default: m.Register })));
const ForgotPassword = React.lazy(() => import('./features/auth/components/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Checkout = React.lazy(() => import('./features/checkout/components/Checkout').then(m => ({ default: m.Checkout })));
const Profile = React.lazy(() => import('./features/profile/components/Profile').then(m => ({ default: m.Profile })));
const AdminDashboard = React.lazy(() => import('./features/admin/components/Dashboard').then(m => ({ default: m.AdminDashboard })));
const Home = React.lazy(() => import('./features/home/components/Home').then(m => ({ default: m.Home })));
const Wishlist = React.lazy(() => import('./features/wishlist/components/Wishlist').then(m => ({ default: m.Wishlist })));
const UserDetail = React.lazy(() => import('./features/admin/components/UserDetail').then(m => ({ default: m.UserDetail })));

// Universal component split loader skeleton
const PageLoader = () => (
  <div className="w-full h-full min-h-[30vh] flex flex-col items-center justify-center animate-pulse">
    <div className="w-8 h-8 rounded-full border-2 border-black border-r-transparent animate-spin mb-4" />
    <span className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Loading Module</span>
  </div>
);

const rootRoute = createRootRoute({
  component: MainLayout,
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Page not found.</p>
      <a href="/" className="btn-primary px-4 py-2 text-sm rounded bg-black text-white hover:bg-black/80 font-black uppercase tracking-widest">Go Home</a>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Suspense fallback={<PageLoader />}><Home /></Suspense>,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: () => (
    <div className="section py-8">
      <Suspense fallback={<PageLoader />}><ProductListing /></Suspense>
    </div>
  ),
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: () => <Suspense fallback={<PageLoader />}><ProductDetail /></Suspense>,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Suspense fallback={<PageLoader />}><Login /></Suspense>,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Suspense fallback={<PageLoader />}><Register /></Suspense>,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartProvider,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>,
});

const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wishlist',
  component: () => <Suspense fallback={<PageLoader />}><Wishlist /></Suspense>,
});

// Protected routes
const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: () => (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/checkout',
  validateSearch: (search: Record<string, unknown>): { productId?: string; quantity?: number } => {
    return {
      productId: search.productId as string | undefined,
      quantity: search.quantity ? Number(search.quantity) : undefined,
    }
  },
  component: () => <Suspense fallback={<PageLoader />}><Checkout /></Suspense>,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/profile',
  component: () => <Suspense fallback={<PageLoader />}><Profile /></Suspense>,
});


const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  validateSearch: (search: Record<string, unknown>): { tab?: string } => {
    return {
      tab: (search.tab as string) || undefined,
    }
  },
  component: () => (
    <ProtectedLayout requireAdmin>
      <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>
    </ProtectedLayout>
  ),
});

const adminUserDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users/$userId',
  component: () => (
    <ProtectedLayout requireAdmin>
      <Suspense fallback={<PageLoader />}>
        <UserDetail />
      </Suspense>
    </ProtectedLayout>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  cartRoute,
  wishlistRoute,
  adminUserDetailRoute,
  adminRoute,
  protectedLayoutRoute.addChildren([
    checkoutRoute,
    profileRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
