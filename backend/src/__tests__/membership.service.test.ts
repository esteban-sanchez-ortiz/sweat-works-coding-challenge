import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MembershipService } from '../services/membership.service';

const mockPrisma = {
  plan: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  membership: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  member: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn((fn) => fn(mockPrisma)),
};

describe('MembershipService', () => {
  let service: MembershipService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MembershipService(mockPrisma as any);
  });

  describe('getPlans', () => {
    it('should return all plans', async () => {
      const plans = [
        { id: '1', name: 'Basic', priceInCents: 2999 },
        { id: '2', name: 'Premium', priceInCents: 5999 },
      ];
      mockPrisma.plan.findMany.mockResolvedValue(plans);

      const result = await service.getPlans();

      expect(result).toEqual(plans);
    });
  });

  describe('assignPlan', () => {
    const memberId = 'member-1';
    const planId = 'plan-1';
    const startDate = new Date('2024-02-01');

    it('should assign plan to member without active membership', async () => {
      mockPrisma.member.findUnique.mockResolvedValue({ id: memberId });
      mockPrisma.plan.findUnique.mockResolvedValue({ id: planId });
      mockPrisma.membership.findFirst.mockResolvedValue(null);
      mockPrisma.membership.create.mockResolvedValue({
        id: 'new-membership',
        memberId,
        planId,
        startDate,
        status: 'ACTIVE',
      });

      const result = await service.assignPlan({ memberId, planId, startDate });

      expect(result.status).toBe('ACTIVE');
      expect(mockPrisma.membership.create).toHaveBeenCalled();
    });

    it('should reject if member already has active membership', async () => {
      mockPrisma.member.findUnique.mockResolvedValue({ id: memberId });
      mockPrisma.plan.findUnique.mockResolvedValue({ id: planId });
      mockPrisma.membership.findFirst.mockResolvedValue({ id: 'existing', status: 'ACTIVE' });

      await expect(service.assignPlan({ memberId, planId, startDate }))
        .rejects.toThrow('Member already has an active membership');
    });

    it('should reject if member does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      await expect(service.assignPlan({ memberId, planId, startDate }))
        .rejects.toThrow('Member not found');
    });

    it('should reject if plan does not exist', async () => {
      mockPrisma.member.findUnique.mockResolvedValue({ id: memberId });
      mockPrisma.plan.findUnique.mockResolvedValue(null);

      await expect(service.assignPlan({ memberId, planId, startDate }))
        .rejects.toThrow('Plan not found');
    });
  });

  describe('cancelMembership', () => {
    const membershipId = 'membership-1';

    it('should cancel active membership with effective date', async () => {
      const cancelledAt = new Date('2024-03-01');
      mockPrisma.membership.findFirst.mockResolvedValue({
        id: membershipId,
        status: 'ACTIVE'
      });
      mockPrisma.membership.update.mockResolvedValue({
        id: membershipId,
        status: 'CANCELLED',
        cancelledAt,
      });

      const result = await service.cancelMembership(membershipId, cancelledAt);

      expect(result.status).toBe('CANCELLED');
      expect(mockPrisma.membership.update).toHaveBeenCalledWith({
        where: { id: membershipId },
        data: { status: 'CANCELLED', cancelledAt },
        include: { plan: true },
      });
    });

    it('should reject if membership not found', async () => {
      mockPrisma.membership.findFirst.mockResolvedValue(null);

      await expect(service.cancelMembership(membershipId, new Date()))
        .rejects.toThrow('Active membership not found');
    });
  });
});
