import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// One-time seed endpoint - call this once to populate lessons
// DELETE THIS FILE after seeding for security
// This endpoint is public and doesn't require authentication
export async function GET() {
  return await seedDatabase()
}

export async function POST() {
  return await seedDatabase()
}

async function seedDatabase() {
  try {
    console.log('Starting database seed...')

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

    // BEGINNER - Email Basics
    const emailBasics = await prisma.lesson.upsert({
      where: { id: 'comm-email-basics' },
      update: {},
      create: {
        id: 'comm-email-basics',
        categoryId: communicationCategory.id,
        title: 'Email Basics: Sending Your First Email',
        description: 'Learn how to compose, send, and reply to emails step by step',
        content: `# Email Basics: Sending Your First Email

## What is Email?
Email (electronic mail) is a way to send messages to anyone with an email address, anywhere in the world, instantly.

## Step-by-Step Guide

### 1. Opening Your Email App
- Look for the email icon on your phone or computer
- Common email apps: Gmail, Mail (iPhone), Outlook
- Tap or click to open

### 2. Starting a New Email
- Find and tap the "Compose" or "New Email" button (usually a + or pencil icon)
- This opens a blank email form

### 3. Filling Out Your Email
- **To:** Enter the recipient's email address (e.g., friend@example.com)
- **Subject:** Write a brief description of what your email is about
- **Message:** Type your message in the large text box

### 4. Sending Your Email
- Review your message
- Click or tap the "Send" button (usually in the top right)
- Your email is sent!

## Tips for Beginners
- Always include a subject line so the recipient knows what your email is about
- Check the "To" field before sending to make sure you have the right address
- Don't worry about making mistakes - you can always send a follow-up email`,
        difficulty: 'Beginner',
        estimatedTime: 10,
        order: 1
      }
    })

    // BEGINNER - Video Calling Basics
    const videoCallBasics = await prisma.lesson.upsert({
      where: { id: 'comm-video-basics' },
      update: {},
      create: {
        id: 'comm-video-basics',
        categoryId: communicationCategory.id,
        title: 'Video Calling Made Easy',
        description: 'Learn to make video calls with FaceTime, Zoom, and WhatsApp',
        content: `# Video Calling Made Easy

## What is Video Calling?
Video calling lets you see and talk to family and friends face-to-face, even when you're far apart. It's like a phone call, but with video!

## Popular Video Calling Apps

### FaceTime (Apple Devices)
- Built into iPhones and iPads
- Works automatically with other Apple users
- Tap the FaceTime icon in your contacts

### Zoom
- Works on any device
- Great for group calls
- Download the Zoom app from the App Store

### WhatsApp
- Free video calls
- Works with your phone number
- Popular worldwide

## How to Make a Video Call

### Step 1: Choose Your App
- Open the video calling app you want to use
- Make sure you're signed in

### Step 2: Find Your Contact
- Look for the person you want to call
- Tap on their name or picture

### Step 3: Start the Call
- Tap the video camera icon
- Wait for them to answer
- You'll see them and they'll see you!

## Tips
- Make sure you have good lighting
- Find a quiet place
- Check your internet connection before calling`,
        difficulty: 'Beginner',
        estimatedTime: 15,
        order: 2
      }
    })

    // BEGINNER - Online Shopping Basics
    const shoppingBasics = await prisma.lesson.upsert({
      where: { id: 'daily-shopping-basics' },
      update: {},
      create: {
        id: 'daily-shopping-basics',
        categoryId: dailyLifeCategory.id,
        title: 'Online Shopping Basics',
        description: 'Learn to shop safely online with Amazon and other retailers',
        content: `# Online Shopping Basics

## What is Online Shopping?
Online shopping lets you buy items from stores on the internet and have them delivered to your home.

## Getting Started

### Step 1: Choose a Shopping Website
Popular options:
- **Amazon** - Almost everything
- **Target.com** - Household items
- **Walmart.com** - Everyday essentials

### Step 2: Create an Account
- Click "Sign In" or "Create Account"
- Enter your email and create a password
- You may need to add your address for delivery

### Step 3: Finding Items
- Use the search bar at the top
- Type what you're looking for (e.g., "coffee maker")
- Browse the results

### Step 4: Adding to Cart
- Click "Add to Cart" on items you want
- Review your cart before checking out
- Remove items you don't want

### Step 5: Checking Out
- Click "Proceed to Checkout"
- Enter your payment information
- Review your order
- Click "Place Order"

## Safety Tips
- Look for "https://" in the website address (the "s" means secure)
- Read product reviews before buying
- Check return policies
- Start with small purchases to build confidence`,
        difficulty: 'Beginner',
        estimatedTime: 15,
        order: 1
      }
    })

    // BEGINNER - Streaming Basics
    const streamingBasics = await prisma.lesson.upsert({
      where: { id: 'ent-streaming-basics' },
      update: {},
      create: {
        id: 'ent-streaming-basics',
        categoryId: entertainmentCategory.id,
        title: 'Streaming Movies and Shows',
        description: 'Enjoy Netflix, YouTube, and other streaming services',
        content: `# Streaming Movies and Shows

## What is Streaming?
Streaming lets you watch movies and TV shows on demand over the internet, without downloading them first.

## Popular Streaming Services

### Netflix
- Thousands of movies and TV shows
- Original content
- Monthly subscription

### YouTube
- Free videos on almost any topic
- Music, tutorials, entertainment
- No subscription needed (premium available)

### Amazon Prime Video
- Included with Amazon Prime membership
- Movies, TV shows, and original content

## Getting Started

### Step 1: Choose a Service
- Decide which service interests you
- Check if you already have access (Prime Video with Amazon Prime)

### Step 2: Sign Up
- Visit the service's website or download the app
- Create an account (email and password)
- Choose a subscription plan if needed

### Step 3: Start Watching
- Browse or search for something to watch
- Click on a title to see details
- Click "Play" to start watching

## Basic Controls
- **Play/Pause:** Tap the screen or use the play button
- **Volume:** Use your device's volume buttons
- **Full Screen:** Tap the full screen icon
- **Back:** Tap back arrow to return to menu

## Tips
- Use Wi-Fi to avoid using mobile data
- Download shows for offline viewing (if available)
- Create profiles for different family members`,
        difficulty: 'Beginner',
        estimatedTime: 12,
        order: 1
      }
    })

    // Add quiz questions
    await prisma.quizQuestion.upsert({
      where: { id: 'quiz-email-1' },
      update: {},
      create: {
        id: 'quiz-email-1',
        lessonId: emailBasics.id,
        question: 'What is the first step to send an email?',
        options: JSON.stringify([
          'Click "Compose" or "New Email"',
          'Enter the recipient\'s address',
          'Write your message',
          'Click "Send"'
        ]),
        correctAnswer: 'Click "Compose" or "New Email"',
        order: 1
      }
    })

    await prisma.quizQuestion.upsert({
      where: { id: 'quiz-video-1' },
      update: {},
      create: {
        id: 'quiz-video-1',
        lessonId: videoCallBasics.id,
        question: 'Which app is built into iPhones for video calling?',
        options: JSON.stringify([
          'FaceTime',
          'Zoom',
          'WhatsApp',
          'Skype'
        ]),
        correctAnswer: 'FaceTime',
        order: 1
      }
    })

    // Add badges
    await prisma.badge.upsert({
      where: { id: 'badge-first-lesson' },
      update: {},
      create: {
        id: 'badge-first-lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        xpThreshold: 10
      }
    })

    await prisma.badge.upsert({
      where: { id: 'badge-week-warrior' },
      update: {},
      create: {
        id: 'badge-week-warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        xpThreshold: 100
      }
    })

    console.log('✅ Seed completed successfully!')

    return NextResponse.json({
      message: 'Database seeded successfully!',
      lessonsCreated: 4,
      categoriesCreated: 3,
      categories: [
        { name: communicationCategory.name, lessons: 2 },
        { name: dailyLifeCategory.name, lessons: 1 },
        { name: entertainmentCategory.name, lessons: 1 }
      ]
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed', details: error.message, stack: error.stack },
      { status: 500 }
    )
  }
}
