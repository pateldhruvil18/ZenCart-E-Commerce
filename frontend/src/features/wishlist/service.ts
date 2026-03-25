import { axiosInstance } from '../../api/axiosInstance';

export const wishlistService = {
  getWishlist: async () => {
    const res = await axiosInstance.get('/wishlist');
    return res;
  },
  addToWishlist: async (productId: string) => {
    const res = await axiosInstance.post('/wishlist', { productId });
    return res;
  },
  removeFromWishlist: async (productId: string) => {
    const res = await axiosInstance.delete(`/wishlist/${productId}`);
    return res;
  },
};
