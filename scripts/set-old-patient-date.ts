import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateOldPatient() {
  // Set old.patient@email.com's lastAccessDate to 8 years ago
  const eightYearsAgo = new Date();
  eightYearsAgo.setFullYear(eightYearsAgo.getFullYear() - 8);

  const updated = await prisma.patient.update({
    where: { email: 'old.patient@email.com' },
    data: { lastAccessDate: eightYearsAgo },
  });

  console.log('\n✓ Updated old.patient@email.com');
  console.log(`  Last access date set to: ${updated.lastAccessDate?.toISOString()}`);
  console.log(`  This account should appear in the 7+ years inactive report\n`);

  await prisma.$disconnect();
}

updateOldPatient().catch(console.error);
