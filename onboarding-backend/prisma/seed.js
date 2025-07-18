const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Seed initial component configurations
 */
async function main() {
  const seedData = [
    { name: 'aboutMe', page: 2 },
    { name: 'birthdate', page: 3 },
  ];

  try {
    await prisma.componentConfig.createMany({
      data: seedData,
      skipDuplicates: true, // avoids inserting if already exists
    });

    console.log('✅ Seed data successfully inserted');
  } catch (error) {
    console.error('❌ Error inserting seed data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
