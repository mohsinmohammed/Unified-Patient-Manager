import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteTestAccounts() {
  const testEmails = ['mms7892@yahoo.com', 'mike@test.com'];
  
  console.log('\n=== Deleting Test Accounts ===\n');

  for (const email of testEmails) {
    try {
      const deleted = await prisma.patient.deleteMany({
        where: { email },
      });

      if (deleted.count > 0) {
        console.log(`✓ Deleted: ${email}`);
      } else {
        console.log(`- Not found: ${email}`);
      }
    } catch (error) {
      console.log(`✗ Error deleting ${email}:`, error);
    }
  }

  console.log('\n=== Done ===\n');
  await prisma.$disconnect();
}

deleteTestAccounts().catch(console.error);
