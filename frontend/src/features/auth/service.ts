import { axiosInstance } from '../../api/axiosInstance';

export const authService = {
  login: async (data: any) => {
    const sessionId = localStorage.getItem('session_id');
    const res = await axiosInstance.post('/auth/login', { ...data, sessionId });
    return res.data;
  },
  register: async (data: any) => {
    const res = await axiosInstance.post('/auth/register', data);
    return res.data;
  },
  verifyOTP: async (data: { email: string; otp: string }) => {
    const sessionId = localStorage.getItem('session_id');
    const res = await axiosInstance.post('/auth/verify-otp', { ...data, sessionId });
    return res.data;
  },
  resendOTP: async (data: { email: string }) => {
    const res = await axiosInstance.post('/auth/resend-otp', data);
    return res.data;
  },
};
