import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/encryption';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional - comment out if you want to preserve existing data)
  console.log('Clearing existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.staff.deleteMany();

  // Create Providers
  console.log('Creating providers...');
  const provider1 = await prisma.provider.create({
    data: {
      email: 'dr.smith@hospital.com',
      password: hashPassword('password123'),
      firstName: 'John',
      lastName: 'Smith',
      role: 'Doctor',
      permissions: ['view_patients', 'update_patients', 'view_bills'],
      isActive: true,
    },
  });

  const provider2 = await prisma.provider.create({
    data: {
      email: 'dr.jones@hospital.com',
      password: hashPassword('password123'),
      firstName: 'Sarah',
      lastName: 'Jones',
      role: 'Nurse Practitioner',
      permissions: ['view_patients', 'update_patients'],
      isActive: true,
    },
  });

  // Create Staff
  console.log('Creating staff...');
  const staff1 = await prisma.staff.create({
    data: {
      email: 'admin@hospital.com',
      password: hashPassword('password123'),
      firstName: 'Admin',
      lastName: 'User',
      role: 'Administrator',
      permissions: ['view_patients', 'inactivate_accounts', 'view_reports'],
      isActive: true,
    },
  });

  // Create Patients
  console.log('Creating patients...');
  const patient1 = await prisma.patient.create({
    data: {
      email: 'john.doe@email.com',
      password: hashPassword('password123'),
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-05-15'),
      phone: '555-0101',
      address: '123 Main St, Anytown, USA',
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 180,
        height: 70,
        respiratoryRate: 16,
        oxygenSaturation: 98,
      },
      visitSummary: 'Annual physical examination. Patient reports feeling well overall.',
      diagnosis: 'Healthy adult, no significant medical issues',
      treatment: 'Continue current lifestyle, schedule follow-up in 1 year',
      labResults: [
        {
          testName: 'Complete Blood Count',
          result: 'Normal',
          date: new Date('2024-01-15'),
          normalRange: 'Within limits',
          notes: 'All values within normal range',
        },
        {
          testName: 'Lipid Panel',
          result: 'Total Cholesterol: 185 mg/dL',
          date: new Date('2024-01-15'),
          normalRange: '<200 mg/dL',
          notes: 'Excellent cholesterol levels',
        },
      ],
      medications: [
        {
          name: 'Multivitamin',
          dosage: '1 tablet',
          frequency: 'Once daily',
          startDate: new Date('2023-01-01'),
          prescribedBy: 'Dr. Smith',
          notes: 'General health maintenance',
        },
      ],
      isActive: true,
      isVerified: true,
      lastAccessDate: new Date(),
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      email: 'jane.smith@email.com',
      password: hashPassword('password123'),
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-08-22'),
      phone: '555-0102',
      address: '456 Oak Ave, Somewhere, USA',
      vitals: {
        bloodPressure: '118/76',
        heartRate: 68,
        temperature: 98.4,
        weight: 145,
        height: 65,
        respiratoryRate: 14,
        oxygenSaturation: 99,
      },
      visitSummary: 'Follow-up visit for hypertension management',
      diagnosis: 'Hypertension, well controlled',
      treatment: 'Continue current medication, low sodium diet',
      labResults: [
        {
          testName: 'Blood Pressure Monitoring',
          result: '118/76 mmHg',
          date: new Date('2024-02-01'),
          normalRange: '<120/80 mmHg',
          notes: 'Blood pressure well controlled',
        },
      ],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: new Date('2023-06-01'),
          prescribedBy: 'Dr. Smith',
          notes: 'For blood pressure management',
        },
      ],
      isActive: true,
      isVerified: true,
      lastAccessDate: new Date(),
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      email: 'mike.johnson@email.com',
      password: hashPassword('password123'),
      firstName: 'Mike',
      lastName: 'Johnson',
      dateOfBirth: new Date('1975-03-10'),
      phone: '555-0103',
      address: '789 Pine Rd, Elsewhere, USA',
      vitals: {
        bloodPressure: '130/85',
        heartRate: 78,
        temperature: 98.7,
        weight: 210,
        height: 72,
        respiratoryRate: 18,
        oxygenSaturation: 97,
      },
      visitSummary: 'Initial consultation for diabetes management',
      diagnosis: 'Type 2 Diabetes Mellitus, newly diagnosed',
      treatment: 'Start metformin, dietary changes, exercise program',
      labResults: [
        {
          testName: 'HbA1c',
          result: '7.2%',
          date: new Date('2024-01-20'),
          normalRange: '<5.7%',
          notes: 'Elevated, indicates diabetes',
        },
        {
          testName: 'Fasting Glucose',
          result: '145 mg/dL',
          date: new Date('2024-01-20'),
          normalRange: '70-100 mg/dL',
          notes: 'Elevated',
        },
      ],
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily with meals',
          startDate: new Date('2024-01-25'),
          prescribedBy: 'Dr. Smith',
          notes: 'Start with lower dose, may increase based on tolerance',
        },
      ],
      isActive: true,
      isVerified: true,
      lastAccessDate: new Date(),
    },
  });

  // Create an inactive patient (for testing inactive accounts feature)
  const inactivePatient = await prisma.patient.create({
    data: {
      email: 'old.patient@email.com',
      password: hashPassword('password123'),
      firstName: 'Old',
      lastName: 'Patient',
      dateOfBirth: new Date('1960-01-01'),
      phone: '555-0199',
      address: '999 Old St, Pastville, USA',
      isActive: true,
      isVerified: true,
      lastAccessDate: new Date('2016-01-01'), // More than 7 years ago
    },
  });

  // Create Bills
  console.log('Creating bills...');
  const bill1 = await prisma.bill.create({
    data: {
      patientId: patient1.id,
      amount: 250.00,
      status: 'paid',
      paymentMethod: 'credit',
      dueDate: new Date('2024-02-01'),
      paidAt: new Date('2024-01-28'),
    },
  });

  const bill2 = await prisma.bill.create({
    data: {
      patientId: patient2.id,
      amount: 150.00,
      status: 'pending',
      paymentMethod: null,
      dueDate: new Date('2024-03-01'),
    },
  });

  const bill3 = await prisma.bill.create({
    data: {
      patientId: patient3.id,
      amount: 500.00,
      status: 'pending',
      paymentMethod: null,
      dueDate: new Date('2024-03-15'),
    },
  });

  // Create some audit log entries
  console.log('Creating audit log entries...');
  await prisma.auditLog.create({
    data: {
      action: 'access',
      actorType: 'provider',
      actorId: provider1.id,
      patientId: patient1.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      details: { action: 'view_patient_record' },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'update',
      actorType: 'provider',
      actorId: provider1.id,
      patientId: patient1.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      details: { action: 'update_patient_vitals' },
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Providers: ${await prisma.provider.count()}`);
  console.log(`- Staff: ${await prisma.staff.count()}`);
  console.log(`- Patients: ${await prisma.patient.count()}`);
  console.log(`- Bills: ${await prisma.bill.count()}`);
  console.log(`- Audit Logs: ${await prisma.auditLog.count()}`);
  console.log('\n🔑 Login Credentials (all use password: password123):');
  console.log('Provider: dr.smith@hospital.com');
  console.log('Provider: dr.jones@hospital.com');
  console.log('Staff: admin@hospital.com');
  console.log('Patient: john.doe@email.com');
  console.log('Patient: jane.smith@email.com');
  console.log('Patient: mike.johnson@email.com');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
