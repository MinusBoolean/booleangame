# Quick Start Guide: 个人博客与新闻平台

**Created**: 2025-06-16

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Git

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blognews?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: OAuth providers
# GITHUB_ID=""
# GITHUB_SECRET=""
```

### 4. Setup Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed initial data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Time Setup

### 1. Create Admin User

```bash
npm run create-admin
# or
npx tsx scripts/create-admin.ts
```

Follow prompts to create admin account.

### 2. Configure RSS Sources

Login to admin dashboard at `/admin`, navigate to Settings > RSS Sources, and add your RSS feeds:

**Recommended AI Sources:**
- https://www.jiqizhixin.com/rss
- https://www.qbitai.com/rss

**Recommended Space Sources:**
- https://www.nasa.gov/news/releases/feed/
- https://spaceflightnow.com/feed/

### 3. Test RSS Crawler

```bash
# Run RSS crawler manually
npm run rss:crawl

# or
npx tsx scripts/rss-crawler.ts
```

### 4. Create First Blog Post

1. Login to admin dashboard
2. Go to Posts > New Post
3. Write your first article
4. Publish or save as draft

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma Client
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database

# RSS
npm run rss:crawl       # Run RSS crawler once
npm run rss:setup-cron  # Setup cron job for RSS

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests

# Linting
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript check
```

### Project Structure

```
my-app/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (site)/       # 前台页面
│   │   ├── (admin)/      # 后台页面
│   │   └── api/          # API路由
│   ├── components/       # React组件
│   ├── lib/              # 工具函数
│   └── types/            # TypeScript类型
├── prisma/
│   └── schema.prisma     # 数据库模型
├── public/               # 静态资源
└── scripts/              # 工具脚本
```

### Key Files

| File | Purpose |
|------|---------|
| `.env.local` | 本地环境变量 |
| `prisma/schema.prisma` | 数据库模型定义 |
| `src/lib/db.ts` | 数据库连接 |
| `src/lib/auth.ts` | 认证配置 |
| `src/lib/rss.ts` | RSS抓取逻辑 |
| `scripts/rss-crawler.ts` | RSS爬虫脚本 |

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy

### Setup RSS Cron Job

On Vercel, use Vercel Cron Jobs:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/rss",
      "schedule": "0 */2 * * *"
    }
  ]
}
```

Or use external cron service (like Cron-Job.org) to hit your RSS endpoint.

### Database Migration on Production

```bash
# After deployment, run:
npx prisma migrate deploy
```

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin <<< "SELECT 1"
```

### RSS Crawler Not Working

1. Check RSS URL is accessible:
   ```bash
   curl -I <rss-url>
   ```
2. Check logs: `npm run rss:crawl`
3. Verify RssSource record exists in database

### Build Failures

1. Clear `.next` folder: `rm -rf .next`
2. Regenerate Prisma Client: `npm run db:generate`
3. Type check: `npm run type-check`
4. Try build again: `npm run build`

## Next Steps

1. [ ] Customize site configuration (title, description, etc.)
2. [ ] Add your RSS sources
3. [ ] Create initial blog content
4. [ ] Configure custom domain
5. [ ] Setup analytics (optional)
6. [ ] Configure CDN for images (optional)
