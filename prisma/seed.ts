import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'body_posture' },
      update: {},
      create: {
        name: 'body_posture',
        displayName: 'Körper & Haltung',
        sortOrder: 1,
        weight: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'breathing' },
      update: {},
      create: {
        name: 'breathing',
        displayName: 'Atmung',
        sortOrder: 2,
        weight: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'voice_activation' },
      update: {},
      create: {
        name: 'voice_activation',
        displayName: 'Stimmaktivierung',
        sortOrder: 3,
        weight: 3,
      },
    }),
    prisma.category.upsert({
      where: { name: 'vocal_range' },
      update: {},
      create: {
        name: 'vocal_range',
        displayName: 'Tonumfang',
        sortOrder: 4,
        weight: 5,
      },
    }),
    prisma.category.upsert({
      where: { name: 'articulation' },
      update: {},
      create: {
        name: 'articulation',
        displayName: 'Artikulation',
        sortOrder: 5,
        weight: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'cool_down' },
      update: {},
      create: {
        name: 'cool_down',
        displayName: 'Cool-Down',
        sortOrder: 6,
        weight: 1,
      },
    }),
  ]);

  // Subcategories
  console.log('Creating subcategories...');
  const subcategoriesData = [
    // Körper & Haltung
    { categoryName: 'body_posture', name: 'loosening', displayName: 'Lockerung', sortOrder: 1 },
    { categoryName: 'body_posture', name: 'posture_tension', displayName: 'Stand & Spannung', sortOrder: 2 },
    // Atmung
    { categoryName: 'breathing', name: 'breath_awareness', displayName: 'Atemwahrnehmung', sortOrder: 1 },
    { categoryName: 'breathing', name: 'breath_technique', displayName: 'Atemtechnik', sortOrder: 2 },
    // Stimmaktivierung
    { categoryName: 'voice_activation', name: 'humming', displayName: 'Summen & Brummen', sortOrder: 1 },
    { categoryName: 'voice_activation', name: 'resonance', displayName: 'Resonanz', sortOrder: 2 },
    // Tonumfang
    { categoryName: 'vocal_range', name: 'scales', displayName: 'Tonleitern', sortOrder: 1 },
    { categoryName: 'vocal_range', name: 'intervals', displayName: 'Intervalle', sortOrder: 2 },
    { categoryName: 'vocal_range', name: 'register', displayName: 'Register', sortOrder: 3 },
    // Artikulation
    { categoryName: 'articulation', name: 'consonants', displayName: 'Konsonanten', sortOrder: 1 },
    { categoryName: 'articulation', name: 'vowels', displayName: 'Vokale', sortOrder: 2 },
  ];

  for (const subcat of subcategoriesData) {
    const category = categories.find(c => c.name === subcat.categoryName);
    if (category) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_name: {
            categoryId: category.id,
            name: subcat.name,
          },
        },
        update: {},
        create: {
          categoryId: category.id,
          name: subcat.name,
          displayName: subcat.displayName,
          sortOrder: subcat.sortOrder,
        },
      });
    }
  }

  // Voice Types
  console.log('Creating voice types...');
  const voiceTypesData = [
    { name: 'soprano', displayName: 'Sopran' },
    { name: 'alto', displayName: 'Alt' },
    { name: 'tenor', displayName: 'Tenor' },
    { name: 'bass', displayName: 'Bass' },
    { name: 'all', displayName: 'Alle' },
  ];

  for (const vt of voiceTypesData) {
    await prisma.voiceType.upsert({
      where: { name: vt.name },
      update: {},
      create: vt,
    });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });