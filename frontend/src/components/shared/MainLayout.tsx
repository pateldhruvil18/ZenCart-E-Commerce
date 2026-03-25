import { Outlet, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scroll Restoration on Route Change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-black selection:text-white">
      <Navbar />

      {/* Main Content Area */}
      <main className={`flex-1 ${!isHome ? 'pt-14 lg:pt-18' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};
