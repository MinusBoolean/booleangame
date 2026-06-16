# Quick Start - Using SQLite (Development Only)

## Option 1: Use SQLite (No external database needed)

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Edit `.env.local`:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="dev-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Then run:
```bash
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

## Option 2: Use PostgreSQL (Production)

See RENDER_DB_SETUP.md for full instructions.
