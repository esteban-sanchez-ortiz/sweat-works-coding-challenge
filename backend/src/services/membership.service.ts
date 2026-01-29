import type { PrismaClient, Membership, Plan } from '@prisma/client';

export interface AssignPlanInput {
  memberId: string;
  planId: string;
  startDate: Date;
}

export class MembershipService {
  constructor(private prisma: PrismaClient) {}

  async getPlans(): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      orderBy: { priceInCents: 'asc' },
    });
  }

  async assignPlan(input: AssignPlanInput): Promise<Membership> {
    const { memberId, planId, startDate } = input;

    // Use transaction to prevent race conditions
    return this.prisma.$transaction(async (tx) => {
      // Verify member exists
      const member = await tx.member.findUnique({ where: { id: memberId } });
      if (!member) {
        throw new Error('Member not found');
      }

      // Verify plan exists
      const plan = await tx.plan.findUnique({ where: { id: planId } });
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Check for existing active membership (application-level check)
      // Note: DB partial unique index is the ultimate safety net
      const existingActive = await tx.membership.findFirst({
        where: { memberId, status: 'ACTIVE' },
      });
      if (existingActive) {
        throw new Error('Member already has an active membership');
      }

      // Create new membership
      return tx.membership.create({
        data: {
          memberId,
          planId,
          startDate,
          status: 'ACTIVE',
        },
        include: { plan: true },
      });
    });
  }

  async cancelMembership(membershipId: string, cancelledAt: Date): Promise<Membership> {
    // Find active membership
    const membership = await this.prisma.membership.findFirst({
      where: { id: membershipId, status: 'ACTIVE' },
    });

    if (!membership) {
      throw new Error('Active membership not found');
    }

    // Update to cancelled with effective date
    return this.prisma.membership.update({
      where: { id: membershipId },
      data: {
        status: 'CANCELLED',
        cancelledAt,
      },
      include: { plan: true },
    });
  }
}
