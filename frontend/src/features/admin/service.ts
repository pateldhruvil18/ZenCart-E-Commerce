import { axiosInstance } from '../../api/axiosInstance';

export const adminService = {
  getDashboard: async () => {
    const res = await axiosInstance.get('/admin/dashboard');
    return res;
  },
  getUsers: async (page: number, search?: string) => {
    const res = await axiosInstance.get('/admin/users', { params: { page, search } });
    return res;
  },
  getUserDetail: async (id: string) => {
    const res = await axiosInstance.get(`/admin/users/${id}`);
    return res;
  },
  updateUser: async ({ id, data }: { id: string; data: { role?: string; status?: string } }) => {
    const res = await axiosInstance.patch(`/admin/users/${id}`, data);
    return res;
  },
  getAdminProducts: async (page: number, search?: string, productId?: string) => {
    const res = await axiosInstance.get('/admin/all-products', { params: { page, search, productId } });
    return res;
  },
  getAllOrders: async (page: number) => {
    const res = await axiosInstance.get('/admin/orders', { params: { page } });
    return res;
  },
  updateOrderStatus: async (id: string, orderStatus: string) => {
    const res = await axiosInstance.patch(`/admin/orders/${id}/status`, { orderStatus });
    return res;
  },
  createProduct: async (data: any) => {
    const res = await axiosInstance.post('/admin/products', data);
    return res;
  },
  updateProduct: async ({ id, data }: { id: string; data: any }) => {
    const res = await axiosInstance.patch(`/admin/products/${id}`, data);
    return res;
  },
  deleteProduct: async (id: string) => {
    const res = await axiosInstance.delete(`/admin/products/${id}`);
    return res;
  },
};
