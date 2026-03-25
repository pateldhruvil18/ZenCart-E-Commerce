import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../service';
import { useAuthStore } from '../../../store/authStore';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      // Update store user details as well (except token which doesn't change here)
      const token = localStorage.getItem('access_token');
      if (token) setAuth(data.data, token);
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: profileService.getMyOrders,
  });
};
