# Vercel Deployment Guide

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### 1. NEXTAUTH_SECRET (Required)
Generate a secure random string:
```bash
openssl rand -base64 32
```
Or use Vercel's environment variable generator.

**Important**: This must be set or NextAuth will fail with `NO_SECRET` error.

### 2. NEXTAUTH_URL (Required)
Set to your production URL:
```
https://your-project.vercel.app
```

### 3. DATABASE_URL (Required for Production)
**SQLite will NOT work in serverless environments.** You need to use PostgreSQL.

Options:
- **Vercel Postgres**: Free tier available, integrates seamlessly
- **Supabase**: Free PostgreSQL database
- **Neon**: Serverless Postgres
- **Railway/Render**: Other PostgreSQL providers

Example connection string format:
```
postgresql://user:password@host:5432/database?sslmode=require
```

## Database Migration

After setting up PostgreSQL:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Run migrations:
```bash
npx prisma migrate deploy
```

Or set up in Vercel build command to run automatically.

## Build Configuration

The project is already configured with:
- `postinstall` script that generates Prisma client
- `build` script that includes Prisma generation
- Webpack configuration for Prisma compatibility

Vercel will automatically:
1. Run `npm install` (triggers `postinstall` → generates Prisma client)
2. Run `npm run build` (includes Prisma generation)

## Troubleshooting

### "Cannot find module '.prisma/client/default'"
- Ensure `postinstall` script runs during build
- Check that `node_modules/.prisma/client/default` exists after build
- Verify Prisma client is generated: `npx prisma generate`

### "NO_SECRET" error
- Set `NEXTAUTH_SECRET` environment variable in Vercel
- Must be at least 32 characters

### Database connection issues
- SQLite doesn't work in serverless - use PostgreSQL
- Ensure `DATABASE_URL` is set correctly
- Check database is accessible from Vercel's IP ranges

## Quick Setup Checklist

- [ ] Set `NEXTAUTH_SECRET` in Vercel environment variables
- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Set up PostgreSQL database
- [ ] Set `DATABASE_URL` with PostgreSQL connection string
- [ ] Update `prisma/schema.prisma` to use `postgresql` provider
- [ ] Run database migrations
- [ ] Deploy to Vercel
