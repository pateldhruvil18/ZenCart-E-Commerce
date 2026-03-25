import { axiosInstance } from '../../api/axiosInstance';

export const cartService = {
  getCart: async () => {
    const res = await axiosInstance.get('/cart');
    return res.data;
  },
  addToCart: async (productId: string, quantity: number = 1) => {
    const res = await axiosInstance.post('/cart', { productId, quantity });
    return res.data;
  },
  updateCartItem: async (productId: string, quantity: number) => {
    const res = await axiosInstance.patch(`/cart/${productId}`, { quantity });
    return res.data;
  },
  removeFromCart: async (productId: string) => {
    const res = await axiosInstance.delete(`/cart/${productId}`);
    return res.data;
  },
};
