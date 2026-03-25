import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../service';
import toast from 'react-hot-toast';

export const useProducts = (params: Record<string, any>, options?: any) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getProducts(params),
    ...options
  });
};

export const useProductDetails = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
  });
};

export const useCreateReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number, comment: string }) => productsService.createReview(productId, data),
    onSuccess: () => {
      toast.success('Your review was securely verified and published!');
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  });
};
