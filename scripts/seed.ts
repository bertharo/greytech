// Use require for Prisma client to work with the generated client structure
// @ts-ignore - @prisma/client is externalized
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with comprehensive lessons...')

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

  // ========== COMMUNICATION CATEGORY ==========
  
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

  // INTERMEDIATE - Email Organization
  const emailOrganization = await prisma.lesson.upsert({
    where: { id: 'comm-email-org' },
    update: {},
    create: {
      id: 'comm-email-org',
      categoryId: communicationCategory.id,
      title: 'Organizing Your Email Inbox',
      description: 'Learn to use folders, labels, and search to manage your emails',
      content: `# Organizing Your Email Inbox

## Why Organize Your Email?
As you receive more emails, your inbox can become cluttered. Organization helps you find important emails quickly.

## Using Folders and Labels

### Creating Folders
1. Look for "Folders" or "Labels" in your email app
2. Create folders for different purposes:
   - Family
   - Work
   - Shopping
   - Bills

### Moving Emails
- Long-press (or right-click) an email
- Select "Move to Folder"
- Choose the appropriate folder

## Using Search
- Use the search bar at the top
- Type keywords like sender name, subject, or date
- Your email app will find matching emails

## Marking Important Emails
- Star or flag important emails
- They'll appear at the top or in a special folder
- Easy to find later

## Tips
- Delete emails you don't need
- Archive old emails to keep inbox clean
- Set up filters to automatically sort emails`,
      difficulty: 'Intermediate',
      estimatedTime: 12,
      order: 3
    }
  })

  // INTERMEDIATE - Advanced Video Calling
  const videoCallAdvanced = await prisma.lesson.upsert({
    where: { id: 'comm-video-advanced' },
    update: {},
    create: {
      id: 'comm-video-advanced',
      categoryId: communicationCategory.id,
      title: 'Advanced Video Call Features',
      description: 'Master screen sharing, group calls, and call settings',
      content: `# Advanced Video Call Features

## Group Video Calls
Connect with multiple people at once!

### Starting a Group Call
1. Open your video calling app
2. Create a new meeting or call
3. Add multiple participants
4. Everyone can see and hear each other

### Managing Participants
- Mute/unmute yourself (microphone icon)
- Turn camera on/off (camera icon)
- Share your screen to show photos or documents

## Screen Sharing
Show what's on your screen to others:
1. Tap the "Share Screen" button
2. Choose what to share (entire screen or specific app)
3. Others can see your screen
4. Tap "Stop Sharing" when done

## Call Settings
- **Mute:** Turn off your microphone
- **Video Off:** Turn off your camera (audio only)
- **Chat:** Send text messages during the call
- **Record:** Save the call (if available)

## Tips for Better Calls
- Use headphones to reduce echo
- Position camera at eye level
- Ensure good lighting on your face
- Close unnecessary apps for better performance`,
      difficulty: 'Intermediate',
      estimatedTime: 15,
      order: 4
    }
  })

  // ADVANCED - Email Security
  const emailSecurity = await prisma.lesson.upsert({
    where: { id: 'comm-email-security' },
    update: {},
    create: {
      id: 'comm-email-security',
      categoryId: communicationCategory.id,
      title: 'Email Security and Privacy',
      description: 'Protect yourself from phishing, spam, and email scams',
      content: `# Email Security and Privacy

## Recognizing Phishing Emails
Phishing emails try to trick you into giving away personal information.

### Warning Signs
- Urgent language ("Act now!" or "Your account will be closed!")
- Requests for passwords or personal information
- Suspicious sender addresses
- Poor spelling and grammar
- Unexpected attachments

### What to Do
- **Don't click links** in suspicious emails
- **Don't download attachments** from unknown senders
- **Verify the sender** - contact them directly if unsure
- **Report phishing** to your email provider

## Spam and Junk Mail
### Identifying Spam
- Emails from unknown senders
- Promotional emails you didn't sign up for
- Suspicious offers or deals

### Managing Spam
1. Mark as spam/junk (usually a button in the email)
2. Block the sender
3. Unsubscribe from legitimate mailing lists (look for "Unsubscribe" link)

## Two-Factor Authentication
Add an extra layer of security:
1. Go to your email account settings
2. Enable "Two-Factor Authentication"
3. You'll need your password AND a code from your phone to sign in

## Best Practices
- Use strong, unique passwords
- Don't share your password with anyone
- Log out when using shared computers
- Regularly review your account activity`,
      difficulty: 'Advanced',
      estimatedTime: 15,
      order: 5
    }
  })

  // ========== DAILY LIFE ESSENTIALS CATEGORY ==========

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

  // INTERMEDIATE - Mobile Banking
  const mobileBanking = await prisma.lesson.upsert({
    where: { id: 'daily-banking' },
    update: {},
    create: {
      id: 'daily-banking',
      categoryId: dailyLifeCategory.id,
      title: 'Mobile Banking 101',
      description: 'Safely manage your money with mobile banking apps',
      content: `# Mobile Banking 101

## What is Mobile Banking?
Mobile banking lets you manage your money using your smartphone or tablet - check balances, pay bills, and transfer money.

## Getting Started

### Step 1: Download Your Bank's App
- Go to the App Store (iPhone) or Google Play (Android)
- Search for your bank's name
- Download the official app (look for your bank's logo)

### Step 2: Sign In
- Open the app
- Enter your online banking username and password
- You may need to verify your identity

## Common Features

### Checking Your Balance
- Open the app
- Your account balance appears on the main screen
- Tap on an account to see transactions

### Paying Bills
1. Tap "Pay Bills" or "Bill Pay"
2. Add a company or person to pay
3. Enter the amount
4. Choose when to pay
5. Confirm the payment

### Transferring Money
1. Tap "Transfer" or "Move Money"
2. Choose accounts (from and to)
3. Enter the amount
4. Confirm the transfer

## Security Tips
- **Never share** your banking password
- Use the **official app** from your bank
- **Log out** when finished
- Enable **biometric login** (fingerprint or face ID) if available
- Check your account regularly for suspicious activity`,
      difficulty: 'Intermediate',
      estimatedTime: 20,
      order: 2
    }
  })

  // INTERMEDIATE - Online Bill Pay
  const billPay = await prisma.lesson.upsert({
    where: { id: 'daily-billpay' },
    update: {},
    create: {
      id: 'daily-billpay',
      categoryId: dailyLifeCategory.id,
      title: 'Paying Bills Online',
      description: 'Set up automatic payments and manage your bills digitally',
      content: `# Paying Bills Online

## Benefits of Online Bill Pay
- Pay bills from home
- Never miss a payment
- Set up automatic payments
- Keep track of payment history

## Setting Up Bill Pay

### Through Your Bank
1. Log into your bank's website or app
2. Find "Bill Pay" or "Pay Bills"
3. Add a company (electric, water, credit card, etc.)
4. Enter the company's information:
   - Account number
   - Company name
   - Payment address

### Through Company Websites
Many companies let you pay directly on their website:
1. Visit the company's website
2. Log in to your account
3. Go to "Pay Bill" or "Make Payment"
4. Enter payment amount and method

## Setting Up Automatic Payments
1. Choose "Auto Pay" or "Recurring Payment"
2. Select payment amount (full balance or fixed amount)
3. Choose payment date
4. Confirm setup

## Managing Your Bills
- Set reminders for bills not on auto-pay
- Review bills before paying
- Keep records of payments
- Check for errors

## Tips
- Start with one bill to get comfortable
- Keep a list of all your bills and due dates
- Review your bank statement regularly`,
      difficulty: 'Intermediate',
      estimatedTime: 15,
      order: 3
    }
  })

  // ADVANCED - Online Shopping Advanced
  const shoppingAdvanced = await prisma.lesson.upsert({
    where: { id: 'daily-shopping-advanced' },
    update: {},
    create: {
      id: 'daily-shopping-advanced',
      categoryId: dailyLifeCategory.id,
      title: 'Advanced Online Shopping',
      description: 'Compare prices, use coupons, and shop securely',
      content: `# Advanced Online Shopping

## Price Comparison
Don't pay more than you need to!

### Comparison Websites
- **Google Shopping** - Compare prices across stores
- **Honey** - Browser extension that finds deals
- **CamelCamelCamel** - Track Amazon price history

### How to Compare
1. Search for the item you want
2. Compare prices across different websites
3. Check shipping costs
4. Read reviews for quality

## Using Coupons and Discounts

### Finding Coupons
- Search "[store name] coupon code" before checkout
- Check coupon websites (RetailMeNot, Coupons.com)
- Sign up for store newsletters for exclusive deals

### Applying Discounts
- Copy the coupon code
- Paste it in the "Promo Code" or "Discount Code" box at checkout
- Click "Apply" to see your savings

## Secure Payment Methods

### Credit Cards vs Debit Cards
- **Credit cards** offer better fraud protection
- **Debit cards** take money directly from your bank
- Consider using a credit card for online purchases

### Payment Services
- **PayPal** - Secure payment without sharing card details
- **Apple Pay / Google Pay** - Quick checkout with your phone

## Reading Reviews
- Look for reviews with photos
- Read both positive and negative reviews
- Check review dates (recent reviews are more relevant)
- Be wary of reviews that seem fake

## Return Policies
- Check return window (usually 30 days)
- Understand return shipping costs
- Keep original packaging until you're sure you'll keep the item
- Save receipts and order confirmations`,
      difficulty: 'Advanced',
      estimatedTime: 18,
      order: 4
    }
  })

  // ========== ENTERTAINMENT & HOBBIES CATEGORY ==========

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

  // BEGINNER - Taking Photos
  const photoBasics = await prisma.lesson.upsert({
    where: { id: 'ent-photo-basics' },
    update: {},
    create: {
      id: 'ent-photo-basics',
      categoryId: entertainmentCategory.id,
      title: 'Taking Great Photos with Your Phone',
      description: 'Learn basic photography tips for smartphone cameras',
      content: `# Taking Great Photos with Your Phone

## Your Phone's Camera
Modern smartphones have excellent cameras built right in!

## Basic Photography Tips

### Lighting
- **Natural light is best** - Take photos near windows or outside
- Avoid harsh shadows on faces
- Turn on the flash only when needed (in dark places)

### Composition
- **Keep it simple** - Don't clutter the background
- **Center your subject** - Put what you're photographing in the middle
- **Get closer** - Fill the frame with your subject

### Taking the Photo
1. Open the Camera app
2. Point at your subject
3. Tap the screen to focus (you'll see a square)
4. Tap the shutter button (circle at bottom) to take the photo

## Viewing Your Photos
- Open the Photos app
- Swipe left or right to see different photos
- Tap a photo to see it full screen
- Pinch to zoom in or out

## Sharing Photos
1. Open the photo you want to share
2. Tap the Share button (square with arrow)
3. Choose how to share (text, email, social media)
4. Select who to send it to

## Tips
- Take multiple photos - you can delete the ones you don't like
- Clean your camera lens for clearer photos
- Hold your phone steady when taking photos`,
      difficulty: 'Beginner',
      estimatedTime: 10,
      order: 2
    }
  })

  // INTERMEDIATE - Social Media Basics
  const socialMediaBasics = await prisma.lesson.upsert({
    where: { id: 'ent-social-basics' },
    update: {},
    create: {
      id: 'ent-social-basics',
      categoryId: entertainmentCategory.id,
      title: 'Social Media Basics',
      description: 'Connect with family and friends on Facebook and Instagram',
      content: `# Social Media Basics

## What is Social Media?
Social media platforms let you connect with family and friends, share photos and updates, and see what others are doing.

## Popular Platforms

### Facebook
- Connect with family and friends
- Share photos and updates
- Join groups
- See news and events

### Instagram
- Share photos and short videos
- Follow friends and interests
- See beautiful photos from around the world

## Getting Started with Facebook

### Creating an Account
1. Download the Facebook app or visit facebook.com
2. Click "Create New Account"
3. Enter your name, email, and password
4. Follow the setup steps

### Finding Friends
- Facebook will suggest people you may know
- Search for friends by name
- Send friend requests
- Wait for them to accept

### Sharing Posts
1. Tap "What's on your mind?" at the top
2. Type your message or add a photo
3. Choose who can see it (Friends, Public, etc.)
4. Tap "Post"

## Privacy Settings
- Go to Settings & Privacy
- Control who can see your posts
- Manage who can send you friend requests
- Review your privacy regularly

## Tips
- Only accept friend requests from people you know
- Be careful what you share publicly
- Think before you post - once it's online, it's hard to remove
- Use privacy settings to control who sees your content`,
      difficulty: 'Intermediate',
      estimatedTime: 18,
      order: 3
    }
  })

  // INTERMEDIATE - E-books
  const ebooks = await prisma.lesson.upsert({
    where: { id: 'ent-ebooks' },
    update: {},
    create: {
      id: 'ent-ebooks',
      categoryId: entertainmentCategory.id,
      title: 'Reading E-books on Your Device',
      description: 'Learn to download and read books on your phone or tablet',
      content: `# Reading E-books on Your Device

## What are E-books?
E-books are digital versions of books that you can read on your phone, tablet, or e-reader.

## Getting Started

### Download a Reading App
Popular options:
- **Kindle** (Amazon) - Largest selection
- **Apple Books** (iPhone/iPad) - Built into Apple devices
- **Google Play Books** (Android) - Works on any device

### Finding Books
1. Open your reading app
2. Tap "Store" or "Shop"
3. Browse categories or search for a title
4. Tap on a book to see details and price

### Buying Books
1. Tap the price or "Buy" button
2. Confirm your purchase
3. The book downloads automatically
4. Tap to start reading

## Reading Your E-book

### Basic Controls
- **Turn pages:** Swipe left or right, or tap the sides
- **Adjust text size:** Pinch to zoom or use settings
- **Bookmark:** Tap the bookmark icon to save your place
- **Search:** Tap the search icon to find words in the book

### Customizing Your Reading Experience
- Change font size and style
- Adjust brightness
- Change background color (white, sepia, dark mode)
- Set reading goals

## Free Books
- **Library apps:** Many libraries offer free e-books (Libby, OverDrive)
- **Public domain:** Classic books are often free
- **Samples:** Try free samples before buying

## Tips
- Download books over Wi-Fi to save mobile data
- Use dark mode for reading at night
- Adjust text size for comfortable reading`,
      difficulty: 'Intermediate',
      estimatedTime: 15,
      order: 4
    }
  })

  // ADVANCED - Photo Management
  const photoAdvanced = await prisma.lesson.upsert({
    where: { id: 'ent-photo-advanced' },
    update: {},
    create: {
      id: 'ent-photo-advanced',
      categoryId: entertainmentCategory.id,
      title: 'Organizing and Editing Photos',
      description: 'Learn to organize, edit, and share your photo collection',
      content: `# Organizing and Editing Photos

## Organizing Your Photos

### Creating Albums
1. Open your Photos app
2. Tap "Albums" tab
3. Tap "+" to create a new album
4. Name your album (e.g., "Family Vacation 2024")
5. Select photos to add

### Using Tags and Faces
- Tag people in photos for easy searching
- Your phone can automatically recognize faces
- Search by person's name to find all their photos

### Deleting Unwanted Photos
- Swipe up on a photo to see options
- Tap "Delete" to remove it
- Empty "Recently Deleted" folder to permanently delete

## Basic Photo Editing

### Built-in Editing Tools
Most phones include basic editing:
- **Crop:** Remove unwanted parts
- **Rotate:** Fix orientation
- **Filters:** Apply color effects
- **Adjust:** Brightness, contrast, saturation

### Using Editing Apps
Popular options:
- **Snapseed** (Google) - Free, powerful editing
- **VSCO** - Professional-looking filters
- **Adobe Lightroom** - Advanced editing tools

## Backing Up Photos

### Cloud Storage
- **iCloud** (Apple) - Automatic backup
- **Google Photos** - Free storage for photos
- **OneDrive** (Microsoft) - Cross-platform

### Setting Up Backup
1. Go to Settings
2. Find "Backup" or "Cloud"
3. Enable automatic backup
4. Photos upload when connected to Wi-Fi

## Sharing Photos

### Creating Shared Albums
- Create an album
- Invite family members
- Everyone can add and view photos

### Printing Photos
- Use online services (Shutterfly, Snapfish)
- Print at local stores (Walmart, CVS)
- Order photo books as gifts

## Tips
- Regularly back up your photos
- Organize as you go - don't let thousands pile up
- Delete duplicates and blurry photos
- Use cloud storage to free up phone space`,
      difficulty: 'Advanced',
      estimatedTime: 20,
      order: 5
    }
  })

  // ========== QUIZ QUESTIONS ==========

  // Email Basics Quiz
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
    where: { id: 'quiz-email-2' },
    update: {},
    create: {
      id: 'quiz-email-2',
      lessonId: emailBasics.id,
      question: 'What should you always include in an email?',
      options: JSON.stringify([
        'A subject line',
        'Your phone number',
        'A photo',
        'Nothing specific'
      ]),
      correctAnswer: 'A subject line',
      order: 2
    }
  })

  // Video Calling Quiz
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

  // Shopping Basics Quiz
  await prisma.quizQuestion.upsert({
    where: { id: 'quiz-shopping-1' },
    update: {},
    create: {
      id: 'quiz-shopping-1',
      lessonId: shoppingBasics.id,
      question: 'What should you look for to ensure a website is secure?',
      options: JSON.stringify([
        'https:// in the address',
        'A green background',
        'Lots of pictures',
        'A long website name'
      ]),
      correctAnswer: 'https:// in the address',
      order: 1
    }
  })

  // Mobile Banking Quiz
  await prisma.quizQuestion.upsert({
    where: { id: 'quiz-banking-1' },
    update: {},
    create: {
      id: 'quiz-banking-1',
      lessonId: mobileBanking.id,
      question: 'What is the most important security tip for mobile banking?',
      options: JSON.stringify([
        'Never share your banking password',
        'Use public Wi-Fi',
        'Share your password with family',
        'Write your password on paper'
      ]),
      correctAnswer: 'Never share your banking password',
      order: 1
    }
  })

  // Streaming Quiz
  await prisma.quizQuestion.upsert({
    where: { id: 'quiz-streaming-1' },
    update: {},
    create: {
      id: 'quiz-streaming-1',
      lessonId: streamingBasics.id,
      question: 'What is streaming?',
      options: JSON.stringify([
        'Watching videos over the internet without downloading',
        'Downloading movies to your device',
        'Buying DVDs online',
        'Watching TV with an antenna'
      ]),
      correctAnswer: 'Watching videos over the internet without downloading',
      order: 1
    }
  })

  // ========== BADGES ==========

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

  await prisma.badge.upsert({
    where: { id: 'badge-level-up' },
    update: {},
    create: {
      id: 'badge-level-up',
      name: 'Level Up',
      description: 'Reach level 5',
      icon: '⭐',
      xpThreshold: 250
    }
  })

  await prisma.badge.upsert({
    where: { id: 'badge-email-master' },
    update: {},
    create: {
      id: 'badge-email-master',
      name: 'Email Master',
      description: 'Complete all email lessons',
      icon: '✉️',
      xpThreshold: 50
    }
  })

  await prisma.badge.upsert({
    where: { id: 'badge-shopper' },
    update: {},
    create: {
      id: 'badge-shopper',
      name: 'Smart Shopper',
      description: 'Complete all shopping lessons',
      icon: '🛒',
      xpThreshold: 60
    }
  })

  console.log('✅ Database seeding completed successfully!')
  console.log(`Created lessons for all skill levels:
  - Beginner: 5 lessons
  - Intermediate: 6 lessons  
  - Advanced: 3 lessons`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
