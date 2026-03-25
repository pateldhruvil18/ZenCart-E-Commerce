import { axiosInstance } from '../../api/axiosInstance';

export const profileService = {
  getProfile: async () => {
    return await axiosInstance.get('/profile');
  },
  updateProfile: async (data: any) => {
    return await axiosInstance.patch('/profile', data);
  },
  getMyOrders: async () => {
    return await axiosInstance.get('/checkout/my-orders');
  },
};
