export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  priceInCents: number;
  createdAt: string;
}

export interface Membership {
  id: string;
  memberId: string;
  planId: string;
  startDate: string;
  cancelledAt: string | null;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  plan: Plan;
}

export interface MemberSummary extends Member {
  activeMembership: Membership | null;
  lastCheckIn: string | null;
  checkInCountLast30Days: number;
}

export interface CheckIn {
  id: string;
  memberId: string;
  timestamp: string;
}

export interface CreateMemberInput {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AssignPlanInput {
  memberId: string;
  planId: string;
  startDate: string;
}
