import { Router } from 'express';
import { MemberService } from '../services/member.service';
import { createMemberSchema, memberIdSchema, searchQuerySchema } from '../validators/member.validator';
import type { PrismaClient } from '@prisma/client';

export function createMemberRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const service = new MemberService(prisma);

  // POST /members - Create a member
  router.post('/', async (req, res) => {
    const parsed = createMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    try {
      const member = await service.create(parsed.data);
      return res.status(201).json(member);
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /members - List/search members
  router.get('/', async (req, res) => {
    const parsed = searchQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    try {
      const members = await service.findAll(parsed.data.search);
      return res.json(members);
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /members/:id - Get member summary
  router.get('/:id', async (req, res) => {
    const parsed = memberIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    try {
      const member = await service.findById(parsed.data.id);
      if (!member) {
        return res.status(404).json({ error: 'Member not found' });
      }
      return res.json(member);
    } catch {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
