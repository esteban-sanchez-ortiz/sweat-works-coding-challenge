import type { PrismaClient, Member } from '@prisma/client';

export interface CreateMemberInput {
  email: string;
  firstName: string;
  lastName: string;
}

export interface MemberSummary extends Member {
  activeMembership: {
    id: string;
    status: string;
    startDate: Date;
    plan: { id: string; name: string; priceInCents: number };
  } | null;
  lastCheckIn: Date | null;
  checkInCountLast30Days: number;
}

export class MemberService {
  constructor(private prisma: PrismaClient) {}

  async create(input: CreateMemberInput): Promise<Member> {
    try {
      return await this.prisma.member.create({ data: input });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async findAll(search?: string): Promise<Member[]> {
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    return this.prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
      where,
    });
  }

  async findById(id: string): Promise<MemberSummary | null> {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) return null;

    const [activeMembership, lastCheckIn, checkInCountLast30Days] = await Promise.all([
      this.prisma.membership.findFirst({
        where: { memberId: id, status: 'ACTIVE' },
        include: { plan: { select: { id: true, name: true, priceInCents: true } } },
      }),
      this.prisma.checkIn.findFirst({
        where: { memberId: id },
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.checkIn.count({
        where: {
          memberId: id,
          timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      ...member,
      activeMembership,
      lastCheckIn: lastCheckIn?.timestamp ?? null,
      checkInCountLast30Days,
    };
  }
}
