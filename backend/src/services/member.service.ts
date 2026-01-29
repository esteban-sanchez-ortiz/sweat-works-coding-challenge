import type { PrismaClient } from '@prisma/client';

export interface CreateMemberInput {
  email: string;
  firstName: string;
  lastName: string;
}

export class MemberService {
  constructor(private prisma: PrismaClient) {}

  async create(_input: CreateMemberInput) {
    // TODO: Implement in next commit (TDD GREEN)
    throw new Error('Not implemented');
  }

  async findAll(_search?: string) {
    // TODO: Implement in next commit (TDD GREEN)
    throw new Error('Not implemented');
  }

  async findById(_id: string) {
    // TODO: Implement in next commit (TDD GREEN)
    throw new Error('Not implemented');
  }
}
