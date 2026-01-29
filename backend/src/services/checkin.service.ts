import type { PrismaClient } from '@prisma/client';

export class CheckInService {
  constructor(private prisma: PrismaClient) {}

  async checkIn(memberId: string) {
    // Check for active membership that hasn't passed cancellation date
    const membership = await this.prisma.membership.findFirst({
      where: {
        memberId,
        status: 'ACTIVE',
      },
    });

    // Validate membership exists and is still valid
    if (!membership) {
      throw new Error('Member does not have an active membership');
    }

    // Check if cancellation date has passed
    if (membership.cancelledAt && membership.cancelledAt <= new Date()) {
      throw new Error('Member does not have an active membership');
    }

    // Record check-in
    return this.prisma.checkIn.create({
      data: { memberId },
    });
  }
}
