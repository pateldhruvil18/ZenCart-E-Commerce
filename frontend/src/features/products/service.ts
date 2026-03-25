import { axiosInstance } from '../../api/axiosInstance';

export const productsService = {
  getProducts: async (params: Record<string, any>) => {
    // Strip falsy values so they don't become empty query params
    const cleanParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    }
    const res = await axiosInstance.get('/products', { params: cleanParams });
    return res;
  },
  getProductById: async (id: string) => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res;
  },
  createReview: async (productId: string, data: { rating: number, comment: string }) => {
    const res = await axiosInstance.post(`/products/${productId}/reviews`, data);
    return res;
  }
};
