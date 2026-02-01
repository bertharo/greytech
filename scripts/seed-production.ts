// Production seed script - use with DATABASE_URL environment variable
// Usage: DATABASE_URL="your-postgres-url" tsx scripts/seed-production.ts

// Use require for Prisma client to work with the generated client structure
// @ts-ignore - @prisma/client is externalized
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding production database with comprehensive lessons...')
  console.log('Database URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Missing ✗')

  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is required')
    console.error('Usage: DATABASE_URL="your-postgres-url" tsx scripts/seed-production.ts')
    process.exit(1)
  }

  // Import the main seeding logic
  // We'll reuse the same seed.ts logic
  const seedScript = require('./seed.ts')
  
  // The seed.ts exports main function, so we can call it
  // Actually, let's just copy the logic here to be safe
  console.log('Starting seed...')
  
  // Create Categories
  const communicationCategory = await prisma.category.upsert({
    where: { id: 'comm-1' },
    update: {
      name: 'Communication',
      description: 'Learn to stay connected with email, video calls, and messaging',
      order: 1
    },
    create: {
      id: 'comm-1',
      name: 'Communication',
      description: 'Learn to stay connected with email, video calls, and messaging',
      order: 1
    }
  })

  const dailyLifeCategory = await prisma.category.upsert({
    where: { id: 'daily-1' },
    update: {
      name: 'Daily Life Essentials',
      description: 'Master online shopping, banking, and essential services',
      order: 2
    },
    create: {
      id: 'daily-1',
      name: 'Daily Life Essentials',
      description: 'Master online shopping, banking, and essential services',
      order: 2
    }
  })

  const entertainmentCategory = await prisma.category.upsert({
    where: { id: 'ent-1' },
    update: {
      name: 'Entertainment & Hobbies',
      description: 'Enjoy streaming, e-books, photos, and music',
      order: 3
    },
    create: {
      id: 'ent-1',
      name: 'Entertainment & Hobbies',
      description: 'Enjoy streaming, e-books, photos, and music',
      order: 3
    }
  })

  console.log('✅ Categories created')

  // Note: This is a simplified version. For full seeding, use the main seed.ts
  // which has all 14 lessons. This script is just to get started.
  console.log('⚠️  This is a minimal seed. Run the full seed script for all lessons.')
  console.log('✅ Basic seeding completed!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
