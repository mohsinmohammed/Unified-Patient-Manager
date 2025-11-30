import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUnverifiedPatients() {
  const patients = await prisma.patient.findMany({
    where: {
      isVerified: false,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      verificationToken: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log('\n=== Unverified Patients ===\n');
  
  if (patients.length === 0) {
    console.log('No unverified patients found.');
  } else {
    patients.forEach((patient) => {
      console.log(`Name: ${patient.firstName} ${patient.lastName}`);
      console.log(`Email: ${patient.email}`);
      console.log(`Verification Token: ${patient.verificationToken}`);
      console.log(`Verification URL: http://localhost:3001/verify?token=${patient.verificationToken}`);
      console.log(`Created: ${patient.createdAt.toISOString()}`);
      console.log('---');
    });
  }

  await prisma.$disconnect();
}

getUnverifiedPatients().catch(console.error);
