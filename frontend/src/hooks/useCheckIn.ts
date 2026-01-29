import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => api.checkIn(memberId),
    onSuccess: (_, memberId) => {
      queryClient.invalidateQueries({ queryKey: ['member', memberId] });
    },
  });
}
