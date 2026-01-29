import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CheckInService } from '../services/checkin.service';

const mockPrisma = {
  membership: {
    findFirst: vi.fn(),
  },
  checkIn: {
    create: vi.fn(),
  },
};

describe('CheckInService', () => {
  let service: CheckInService;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-02-15'));
    service = new CheckInService(mockPrisma as any);
  });

  describe('checkIn', () => {
    const memberId = 'member-1';

    it('should allow check-in for member with active membership', async () => {
      mockPrisma.membership.findFirst.mockResolvedValue({
        id: 'membership-1',
        status: 'ACTIVE',
        cancelledAt: null,
      });
      mockPrisma.checkIn.create.mockResolvedValue({
        id: 'checkin-1',
        memberId,
        timestamp: new Date(),
      });

      const result = await service.checkIn(memberId);

      expect(result.memberId).toBe(memberId);
      expect(mockPrisma.checkIn.create).toHaveBeenCalled();
    });

    it('should allow check-in if cancellation date is in the future', async () => {
      mockPrisma.membership.findFirst.mockResolvedValue({
        id: 'membership-1',
        status: 'ACTIVE',
        cancelledAt: new Date('2024-03-01'), // Future date
      });
      mockPrisma.checkIn.create.mockResolvedValue({
        id: 'checkin-1',
        memberId,
        timestamp: new Date(),
      });

      const result = await service.checkIn(memberId);

      expect(result.memberId).toBe(memberId);
    });

    it('should reject check-in if no active membership', async () => {
      mockPrisma.membership.findFirst.mockResolvedValue(null);

      await expect(service.checkIn(memberId))
        .rejects.toThrow('Member does not have an active membership');
    });

    it('should reject check-in if cancellation date has passed', async () => {
      mockPrisma.membership.findFirst.mockResolvedValue({
        id: 'membership-1',
        status: 'ACTIVE',
        cancelledAt: new Date('2024-02-01'), // Past date
      });

      await expect(service.checkIn(memberId))
        .rejects.toThrow('Member does not have an active membership');
    });
  });
});
