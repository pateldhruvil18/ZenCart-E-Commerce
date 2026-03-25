import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../service';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
  });
};

export const useAdminOrders = (page: number) => {
  return useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => adminService.getAllOrders(page),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] }); // refresh revenue when COD delivered
    },
  });
};

export const useAdminUsers = (page: number) => {
  return useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminService.getUsers(page),
  });
};

export const useAdminProducts = (page: number, search?: string, productId?: string) => {
  return useQuery({
    queryKey: ['admin-products', page, search, productId],
    queryFn: () => adminService.getAdminProducts(page, search, productId),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });
};
