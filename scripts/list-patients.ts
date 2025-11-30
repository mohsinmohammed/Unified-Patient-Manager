import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listPatients() {
  const patients = await prisma.patient.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isVerified: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log('\n=== Current Patient Accounts ===\n');
  
  if (patients.length === 0) {
    console.log('No patients found.');
  } else {
    patients.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.email}`);
      console.log(`   Name: ${patient.firstName} ${patient.lastName}`);
      console.log(`   Verified: ${patient.isVerified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${patient.createdAt.toISOString()}`);
      console.log('');
    });
  }

  await prisma.$disconnect();
}

listPatients().catch(console.error);
