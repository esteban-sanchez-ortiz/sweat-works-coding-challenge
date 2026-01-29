import type {
  Member,
  MemberSummary,
  Plan,
  Membership,
  CheckIn,
  CreateMemberInput,
  AssignPlanInput,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Members
  getMembers: (search?: string) =>
    request<Member[]>(`/api/members${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  getMember: (id: string) => request<MemberSummary>(`/api/members/${id}`),

  createMember: (data: CreateMemberInput) =>
    request<Member>('/api/members', { method: 'POST', body: JSON.stringify(data) }),

  // Plans
  getPlans: () => request<Plan[]>('/api/memberships/plans'),

  // Memberships
  assignPlan: (data: AssignPlanInput) =>
    request<Membership>('/api/memberships', { method: 'POST', body: JSON.stringify(data) }),

  cancelMembership: (id: string, cancelledAt: string) =>
    request<Membership>(`/api/memberships/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ cancelledAt }),
    }),

  // Check-ins
  checkIn: (memberId: string) =>
    request<CheckIn>('/api/check-ins', { method: 'POST', body: JSON.stringify({ memberId }) }),
};
