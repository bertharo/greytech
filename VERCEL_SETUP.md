# Vercel Setup Instructions

## Environment Variables

Set these in your Vercel project (Settings → Environment Variables):

### Required Variables:

1. **DATABASE_URL**
   ```
   postgresql://neondb_owner:npg_1rDSNY3ZaXBe@ep-curly-glitter-ah9c2b3u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

2. **NEXTAUTH_SECRET**
   Generate with: `openssl rand -base64 32`
   Or use any secure random string (minimum 32 characters)

3. **NEXTAUTH_URL**
   ```
   https://greytech-three.vercel.app
   ```
   (Update with your actual Vercel domain)

## Database Setup

The database has been migrated to PostgreSQL (Neon). The migrations are in `prisma/migrations/`.

To seed the database with initial data (categories, lessons, badges), run:
```bash
npm run db:seed
```

Or manually set DATABASE_URL and run:
```bash
DATABASE_URL="your-connection-string" npx tsx scripts/seed.ts
```

## Deployment

1. Push your code to GitHub
2. Vercel will automatically:
   - Run `npm install` (triggers `postinstall` → generates Prisma client)
   - Run `npm run build` (includes Prisma generation and Next.js build)
3. The Prisma client will be generated with the correct structure
4. Your application should work!

## Troubleshooting

- **"Cannot find module .prisma/client/default"**: Check Vercel build logs to ensure postinstall script ran
- **"NO_SECRET" error**: Make sure NEXTAUTH_SECRET is set in Vercel
- **Database connection errors**: Verify DATABASE_URL is correct and database is accessible
