import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes';
import { ThemeProvider } from './utils/theme-provider';
import { Toaster } from 'react-hot-toast';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ecommerce-theme">
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
};
