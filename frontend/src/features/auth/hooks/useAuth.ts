import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/authStore';
import { authService } from '../service';

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data: any) => {
      if (data?.accessToken) {
        setAuth(data.user, data.accessToken);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useVerifyOTP = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: (data: any) => {
      if (data?.accessToken) {
        setAuth(data.user, data.accessToken);
      }
    },
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationFn: authService.resendOTP,
  });
};
