import { Router } from 'express';
import { CheckInService } from '../services/checkin.service';
import { checkInSchema } from '../validators/checkin.validator';
import type { PrismaClient } from '@prisma/client';

export function createCheckInRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const service = new CheckInService(prisma);

  // POST /check-ins - Record a check-in
  router.post('/', async (req, res) => {
    const parsed = checkInSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    try {
      const checkIn = await service.checkIn(parsed.data.memberId);
      return res.status(201).json(checkIn);
    } catch (error: any) {
      if (error.message === 'Member does not have an active membership') {
        return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
