# TechBridge - Technology Learning Platform for Older Adults

A gamified web application designed to help older adults (55+) learn and stay current with modern technology tools relevant to their daily lives.

## Features

- **Personalized Assessment**: 12-question questionnaire to assess technical abilities and place users at appropriate skill levels
- **Flexible Time Commitment**: Users can choose daily learning time (5, 10, 15, 20, or 30 minutes)
- **Gamification System**:
  - XP (Experience Points) for completing lessons
  - Level progression system
  - Daily streak tracking
  - Badge/achievement system
  - Hearts/lives system (5 hearts per day)
- **Adaptive Learning**: Content tailored to user's skill level (Beginner, Intermediate, Advanced)
- **Multiple Categories**: 
  - Communication (email, video calls, messaging)
  - Daily Life Essentials (shopping, banking, telehealth)
  - Entertainment & Hobbies (streaming, e-books, photos)
- **Progress Tracking**: Comprehensive dashboard showing learning statistics and achievements
- **Accessible Design**: Large fonts, high contrast, keyboard navigation, screen reader support

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: SQLite (via Prisma)
- **Authentication**: NextAuth.js
- **ORM**: Prisma

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd greytech
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production-min-32-chars"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. (Optional) Seed the database with initial content:
```bash
npm run db:seed
```

Note: If the seed script has issues, you can manually add categories and lessons through the database or create an admin interface.

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
greytech/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── assessment/        # Assessment questionnaire page
│   ├── dashboard/         # Main dashboard
│   ├── learn/             # Lessons listing page
│   ├── lesson/            # Individual lesson pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── progress/          # Progress tracking page
│   └── time-commitment/    # Time selection page
├── components/            # React components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
└── scripts/              # Utility scripts
    └── seed.ts           # Database seeding script
```

## User Flow

1. **Registration**: User creates an account with email and password
2. **Assessment**: User completes 12-question technical ability assessment
3. **Time Selection**: User chooses daily time commitment (5-30 minutes)
4. **Dashboard**: User sees their stats, streak, level, and available lessons
5. **Learning**: User selects lessons, completes content, and takes quizzes
6. **Progress**: User tracks their learning statistics and earned badges

## Database Schema

Key models:
- **User**: User accounts with gamification stats (XP, level, streak, hearts)
- **Assessment**: Assessment results and skill level placement
- **Category**: Lesson categories (Communication, Daily Life, etc.)
- **Lesson**: Individual lessons with content and metadata
- **QuizQuestion**: Quiz questions for lessons
- **Progress**: User progress on lessons (completion, scores, XP earned)
- **Badge**: Achievement badges
- **UserBadge**: User-badge relationships

## Gamification Mechanics

- **XP System**: Earn XP by completing lessons (base XP = estimated time × 2, bonus for high quiz scores)
- **Level System**: Levels increase based on total XP (exponential curve)
- **Streak System**: Daily learning streaks reset if a day is missed
- **Hearts System**: 5 hearts per day, can be used for quiz attempts
- **Badges**: Unlocked for milestones (first lesson, 7-day streak, level 5, etc.)

## Accessibility Features

- Minimum font size: 18px
- High contrast color scheme
- Large touch targets (minimum 48×48px)
- Keyboard navigation support
- Screen reader friendly (ARIA labels)
- Focus indicators for keyboard users

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with initial data

### Database Management

- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Future Enhancements

- [ ] Native mobile apps (iOS/Android)
- [ ] Video tutorials
- [ ] Spaced repetition system
- [ ] Community features
- [ ] Family member accounts
- [ ] Advanced analytics
- [ ] Content management system
- [ ] Multi-language support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
