import { z } from 'zod';

export const checkInSchema = z.object({
  memberId: z.string().uuid('Invalid member ID'),
});

export type CheckInDto = z.infer<typeof checkInSchema>;
