import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { AssignPlanInput } from '../types';

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: api.getPlans,
  });
}

export function useAssignPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignPlanInput) => api.assignPlan(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', variables.memberId] });
    },
  });
}

export function useCancelMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cancelledAt }: { id: string; cancelledAt: string }) =>
      api.cancelMembership(id, cancelledAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['member'] });
    },
  });
}
