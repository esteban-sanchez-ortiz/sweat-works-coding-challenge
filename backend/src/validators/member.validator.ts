import { z } from 'zod';

export const createMemberSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
});

export const memberIdSchema = z.object({
  id: z.string().uuid('Invalid member ID'),
});

export const searchQuerySchema = z.object({
  search: z.string().optional(),
});

export type CreateMemberDto = z.infer<typeof createMemberSchema>;
