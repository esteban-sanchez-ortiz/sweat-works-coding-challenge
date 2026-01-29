import { Router } from 'express';
import { MembershipService } from '../services/membership.service';
import {
  assignPlanSchema,
  cancelMembershipSchema,
  membershipIdSchema,
} from '../validators/membership.validator';
import type { PrismaClient } from '@prisma/client';

export function createMembershipRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const service = new MembershipService(prisma);

  // GET /plans - List all plans
  router.get('/plans', async (_, res) => {
    try {
      const plans = await service.getPlans();
      return res.json(plans);
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /memberships - Assign plan to member
  router.post('/', async (req, res) => {
    const parsed = assignPlanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    try {
      const membership = await service.assignPlan(parsed.data);
      return res.status(201).json(membership);
    } catch (error: any) {
      if (error.message === 'Member not found' || error.message === 'Plan not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Member already has an active membership') {
        return res.status(409).json({ error: error.message });
      }
      // Handle DB constraint violation (race condition safety net)
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Member already has an active membership' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PATCH /memberships/:id/cancel - Cancel membership
  router.patch('/:id/cancel', async (req, res) => {
    const idParsed = membershipIdSchema.safeParse(req.params);
    if (!idParsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: idParsed.error.flatten() });
    }

    const bodyParsed = cancelMembershipSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: bodyParsed.error.flatten() });
    }

    try {
      const membership = await service.cancelMembership(idParsed.data.id, bodyParsed.data.cancelledAt);
      return res.json(membership);
    } catch (error: any) {
      if (error.message === 'Active membership not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
