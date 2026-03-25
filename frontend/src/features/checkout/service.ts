import { axiosInstance } from '../../api/axiosInstance';

export const checkoutService = {
  createOrder: async (data: any) => {
    const response = await axiosInstance.post('/checkout/create-order', data);
    return response.data.data || response.data;
  },
  verifyPayment: async (paymentData: any) => {
    const res = await axiosInstance.post('/checkout/verify-payment', paymentData);
    return res.data;
  },
};

export const addressService = {
  getAddresses: async () => {
    const res = await axiosInstance.get('/address');
    return res.data;
  },
  addAddress: async (data: any) => {
    const res = await axiosInstance.post('/address', data);
    return res.data;
  },
};
