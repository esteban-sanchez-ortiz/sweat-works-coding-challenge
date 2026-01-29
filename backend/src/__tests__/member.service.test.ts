import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemberService } from '../services/member.service';

// Mock Prisma client
const mockPrisma = {
  member: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
  membership: {
    findFirst: vi.fn(),
  },
  checkIn: {
    findFirst: vi.fn(),
    count: vi.fn(),
  },
};

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MemberService(mockPrisma as any);
  });

  describe('create', () => {
    it('should create a member with valid data', async () => {
      const input = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };
      const expected = { id: '123', ...input, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.member.create.mockResolvedValue(expected);

      const result = await service.create(input);

      expect(mockPrisma.member.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(expected);
    });

    it('should throw on duplicate email', async () => {
      const input = { email: 'existing@example.com', firstName: 'Test', lastName: 'User' };
      mockPrisma.member.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create(input)).rejects.toThrow('Email already exists');
    });
  });

  describe('findAll', () => {
    it('should return all members when no search query', async () => {
      const members = [
        { id: '1', email: 'a@test.com', firstName: 'Alice', lastName: 'Smith' },
        { id: '2', email: 'b@test.com', firstName: 'Bob', lastName: 'Jones' },
      ];
      mockPrisma.member.findMany.mockResolvedValue(members);

      const result = await service.findAll();

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        where: undefined,
      });
      expect(result).toEqual(members);
    });

    it('should filter members by search query (name or email)', async () => {
      const members = [{ id: '1', email: 'alice@test.com', firstName: 'Alice', lastName: 'Smith' }];
      mockPrisma.member.findMany.mockResolvedValue(members);

      const result = await service.findAll('alice');

      expect(mockPrisma.member.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        where: {
          OR: [
            { email: { contains: 'alice', mode: 'insensitive' } },
            { firstName: { contains: 'alice', mode: 'insensitive' } },
            { lastName: { contains: 'alice', mode: 'insensitive' } },
          ],
        },
      });
      expect(result).toEqual(members);
    });
  });

  describe('findById (with summary)', () => {
    const memberId = 'member-123';
    const mockMember = {
      id: memberId,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should return member with active membership and check-in stats', async () => {
      const mockMembership = {
        id: 'membership-1',
        status: 'ACTIVE',
        startDate: new Date(),
        plan: { id: 'plan-1', name: 'Basic', priceInCents: 2999 },
      };
      const mockLastCheckIn = { timestamp: new Date('2024-01-15') };

      mockPrisma.member.findUnique.mockResolvedValue(mockMember);
      mockPrisma.membership.findFirst.mockResolvedValue(mockMembership);
      mockPrisma.checkIn.findFirst.mockResolvedValue(mockLastCheckIn);
      mockPrisma.checkIn.count.mockResolvedValue(5);

      const result = await service.findById(memberId);

      expect(result).toMatchObject({
        ...mockMember,
        activeMembership: mockMembership,
        lastCheckIn: mockLastCheckIn.timestamp,
        checkInCountLast30Days: 5,
      });
    });

    it('should return member without membership if none active', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(mockMember);
      mockPrisma.membership.findFirst.mockResolvedValue(null);
      mockPrisma.checkIn.findFirst.mockResolvedValue(null);
      mockPrisma.checkIn.count.mockResolvedValue(0);

      const result = await service.findById(memberId);

      expect(result).toMatchObject({
        ...mockMember,
        activeMembership: null,
        lastCheckIn: null,
        checkInCountLast30Days: 0,
      });
    });

    it('should return null for non-existent member', async () => {
      mockPrisma.member.findUnique.mockResolvedValue(null);

      const result = await service.findById('non-existent');

      expect(result).toBeNull();
    });
  });
});
