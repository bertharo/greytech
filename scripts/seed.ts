import { PrismaClient } from '@prisma/client'

// @ts-ignore - Prisma 7 type issue, works at runtime
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Categories
  const communicationCategory = await prisma.category.upsert({
    where: { id: 'comm-1' },
    update: {
      name: 'Communication',
      description: 'Learn to stay connected with email, video calls, and messaging',
      icon: '💬',
      order: 1
    },
    create: {
      id: 'comm-1',
      name: 'Communication',
      description: 'Learn to stay connected with email, video calls, and messaging',
      icon: '💬',
      order: 1
    }
  })

  const dailyLifeCategory = await prisma.category.upsert({
    where: { id: 'daily-1' },
    update: {
      name: 'Daily Life Essentials',
      description: 'Master online shopping, banking, and essential services',
      icon: '🛒',
      order: 2
    },
    create: {
      id: 'daily-1',
      name: 'Daily Life Essentials',
      description: 'Master online shopping, banking, and essential services',
      icon: '🛒',
      order: 2
    }
  })

  const entertainmentCategory = await prisma.category.upsert({
    where: { id: 'ent-1' },
    update: {
      name: 'Entertainment & Hobbies',
      description: 'Enjoy streaming, e-books, photos, and music',
      icon: '🎬',
      order: 3
    },
    create: {
      id: 'ent-1',
      name: 'Entertainment & Hobbies',
      description: 'Enjoy streaming, e-books, photos, and music',
      icon: '🎬',
      order: 3
    }
  })

  // Create Lessons for Communication
  await prisma.lesson.upsert({
    where: { id: 'lesson-1' },
    update: {},
    create: {
      id: 'lesson-1',
      categoryId: communicationCategory.id,
      title: 'Email Basics: Sending Your First Email',
      description: 'Learn how to compose, send, and reply to emails',
      content: JSON.stringify({
        sections: [
          {
            type: 'text',
            content: 'Welcome to your first email lesson! We\'ll walk you through sending an email step by step.'
          },
          {
            type: 'text',
            content: 'To send an email: 1. Click "Compose" or "New Email", 2. Enter the recipient\'s email address, 3. Write your subject, 4. Type your message, 5. Click "Send"'
          }
        ]
      }),
      difficulty: 'Beginner',
      estimatedTime: 10,
      order: 1
    }
  })

  await prisma.lesson.upsert({
    where: { id: 'lesson-2' },
    update: {},
    create: {
      id: 'lesson-2',
      categoryId: communicationCategory.id,
      title: 'Video Calling Made Easy',
      description: 'Master video calls with Zoom, FaceTime, and WhatsApp',
      content: JSON.stringify({
        sections: [
          {
            type: 'text',
            content: 'Video calling lets you see and talk to family and friends face-to-face, even when you\'re far apart.'
          },
          {
            type: 'text',
            content: 'Popular video calling apps include Zoom, FaceTime (for Apple devices), and WhatsApp.'
          }
        ]
      }),
      difficulty: 'Beginner',
      estimatedTime: 15,
      order: 2
    }
  })

  // Create Lessons for Daily Life
  await prisma.lesson.upsert({
    where: { id: 'lesson-3' },
    update: {},
    create: {
      id: 'lesson-3',
      categoryId: dailyLifeCategory.id,
      title: 'Online Shopping Basics',
      description: 'Learn to shop safely online with Amazon and other retailers',
      content: JSON.stringify({
        sections: [
          {
            type: 'text',
            content: 'Online shopping is convenient and can save you time. Let\'s learn how to do it safely.'
          },
          {
            type: 'text',
            content: 'Always look for secure websites (https://) and read reviews before purchasing.'
          }
        ]
      }),
      difficulty: 'Beginner',
      estimatedTime: 12,
      order: 1
    }
  })

  await prisma.lesson.upsert({
    where: { id: 'lesson-4' },
    update: {},
    create: {
      id: 'lesson-4',
      categoryId: dailyLifeCategory.id,
      title: 'Mobile Banking 101',
      description: 'Safely manage your money with mobile banking apps',
      content: JSON.stringify({
        sections: [
          {
            type: 'text',
            content: 'Mobile banking lets you check your balance, pay bills, and transfer money from your phone.'
          },
          {
            type: 'text',
            content: 'Always use your bank\'s official app and never share your password with anyone.'
          }
        ]
      }),
      difficulty: 'Intermediate',
      estimatedTime: 15,
      order: 2
    }
  })

  // Create Lessons for Entertainment
  await prisma.lesson.upsert({
    where: { id: 'lesson-5' },
    update: {},
    create: {
      id: 'lesson-5',
      categoryId: entertainmentCategory.id,
      title: 'Streaming Movies and Shows',
      description: 'Enjoy Netflix, YouTube, and other streaming services',
      content: JSON.stringify({
        sections: [
          {
            type: 'text',
            content: 'Streaming services let you watch movies and TV shows on demand.'
          },
          {
            type: 'text',
            content: 'Popular services include Netflix, YouTube, and Amazon Prime Video.'
          }
        ]
      }),
      difficulty: 'Beginner',
      estimatedTime: 10,
      order: 1
    }
  })

  // Create Quiz Questions for first lesson
  await prisma.quizQuestion.upsert({
    where: { id: 'quiz-1' },
    update: {},
    create: {
      id: 'quiz-1',
      lessonId: 'lesson-1',
      question: 'What is the first step to send an email?',
      type: 'multiple_choice',
      options: JSON.stringify([
        'Click "Compose" or "New Email"',
        'Enter the recipient\'s address',
        'Write your message',
        'Click "Send"'
      ]),
      correctAnswer: 0,
      explanation: 'The first step is always to click "Compose" or "New Email" to start a new message.',
      order: 1
    }
  })

  await prisma.quizQuestion.upsert({
    where: { id: 'quiz-2' },
    update: {},
    create: {
      id: 'quiz-2',
      lessonId: 'lesson-1',
      question: 'What should you always include in an email?',
      type: 'multiple_choice',
      options: JSON.stringify([
        'A subject line',
        'Your phone number',
        'A photo',
        'Nothing specific'
      ]),
      correctAnswer: 0,
      explanation: 'A subject line helps the recipient understand what your email is about.',
      order: 2
    }
  })

  // Create some badges
  await prisma.badge.upsert({
    where: { id: 'badge-1' },
    update: {},
    create: {
      id: 'badge-1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      condition: JSON.stringify({ type: 'lessons_completed', count: 1 }),
      rarity: 'common'
    }
  })

  await prisma.badge.upsert({
    where: { id: 'badge-2' },
    update: {},
    create: {
      id: 'badge-2',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      condition: JSON.stringify({ type: 'streak', days: 7 }),
      rarity: 'rare'
    }
  })

  await prisma.badge.upsert({
    where: { id: 'badge-3' },
    update: {},
    create: {
      id: 'badge-3',
      name: 'Level Up',
      description: 'Reach level 5',
      icon: '⭐',
      condition: JSON.stringify({ type: 'level', level: 5 }),
      rarity: 'epic'
    }
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
