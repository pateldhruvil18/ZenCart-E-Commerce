import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checkoutService, addressService } from '../service';

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAddresses,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressService.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: checkoutService.createOrder,
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: checkoutService.verifyPayment,
  });
};
