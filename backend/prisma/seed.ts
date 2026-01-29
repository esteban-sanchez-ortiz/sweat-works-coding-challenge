import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create partial unique index for "only one active membership" rule
  // DATABASE-LEVEL enforcement of business constraint
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "unique_active_membership_per_member"
    ON "Membership" ("memberId")
    WHERE status = 'ACTIVE';
  `);
  console.log('Ensured partial unique index exists');

  // Create plans
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { name: 'Basic' },
      update: {},
      create: {
        name: 'Basic',
        description: 'Access to gym floor and basic equipment',
        priceInCents: 2999,
      },
    }),
    prisma.plan.upsert({
      where: { name: 'Premium' },
      update: {},
      create: {
        name: 'Premium',
        description: 'Full access including classes and pool',
        priceInCents: 5999,
      },
    }),
    prisma.plan.upsert({
      where: { name: 'VIP' },
      update: {},
      create: {
        name: 'VIP',
        description: 'All Premium benefits plus personal trainer sessions',
        priceInCents: 9999,
      },
    }),
  ]);

  console.log(`Created ${plans.length} plans`);

  // Create sample members
  const members = await Promise.all([
    prisma.member.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
    }),
    prisma.member.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
      },
    }),
  ]);

  console.log(`Created ${members.length} members`);

  // Assign active membership to John
  const basicPlan = plans.find(p => p.name === 'Basic')!;
  await prisma.membership.upsert({
    where: { id: 'seed-membership-john' },
    update: {},
    create: {
      id: 'seed-membership-john',
      memberId: members[0].id,
      planId: basicPlan.id,
      startDate: new Date(),
      status: 'ACTIVE',
    },
  });

  console.log('Assigned Basic plan to John');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
