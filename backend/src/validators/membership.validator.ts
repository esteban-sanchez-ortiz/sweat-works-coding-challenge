import { z } from 'zod';

export const assignPlanSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
  planId: z.string().uuid('Invalid plan ID'),
  startDate: z.coerce.date(),
});

export const cancelMembershipSchema = z.object({
  cancelledAt: z.coerce.date(),
});

export const membershipIdSchema = z.object({
  id: z.string().uuid('Invalid membership ID'),
});

export type AssignPlanDto = z.infer<typeof assignPlanSchema>;
export type CancelMembershipDto = z.infer<typeof cancelMembershipSchema>;
