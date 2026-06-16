# Data Model: 个人博客与新闻平台

**Created**: 2025-06-16

## Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     User        │     │   BlogPost      │     │      Tag        │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ authorId (FK)   │     │ id (PK)         │
│ email           │     ├─────────────────┤     │ name            │
│ name            │     │ id (PK)         │>────┤ slug            │
│ password        │     │ title           │     │ description     │
│ role            │     │ slug            │     └─────────────────┘
│ avatar          │     │ content         │            ▲
│ createdAt       │     │ excerpt         │            │
│ updatedAt       │     │ coverImage      │     ┌─────────────────┐
└─────────────────┘     │ status          │     │  BlogPostTag    │
                        │ publishedAt     │     ├─────────────────┤
┌─────────────────┐     │ viewCount       │     │ postId (FK)     │
│      News       │     │ authorId (FK)   │     │ tagId (FK)      │
├─────────────────┤     │ createdAt       │     └─────────────────┘
│ id (PK)         │     │ updatedAt       │
│ title           │     └─────────────────┘
│ slug            │
│ content         │     ┌─────────────────┐
│ excerpt         │     │  PostRevision   │
│ coverImage      │     ├─────────────────┤
│ sourceUrl       │     │ id (PK)         │
│ sourceName      │     │ postId (FK)     │
│ category        │────<│ content         │
│ publishedAt     │     │ title           │
│ fetchedAt       │     │ createdAt       │
│ viewCount       │     └─────────────────┘
│ isFeatured      │
│ status          │     ┌─────────────────┐
└─────────────────┘     │   RssSource     │
                        ├─────────────────┤
                        │ id (PK)         │
                        │ name            │
                        │ url             │
                        │ category        │
                        │ isActive        │
                        │ lastFetchedAt   │
                        │ fetchInterval   │
                        │ config (JSON)   │
                        └─────────────────┘
```

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户模型
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // bcrypt hashed
  role      UserRole @default(EDITOR)
  avatar    String?
  
  posts     BlogPost[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  ADMIN    // 管理员
  EDITOR   // 编辑/博主
}

// 博客文章模型
model BlogPost {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  content     String      // Markdown content
  excerpt     String?     // 自动生成的摘要
  coverImage  String?
  
  status      PostStatus  @default(DRAFT)
  publishedAt DateTime?
  viewCount   Int         @default(0)
  
  authorId    String
  author      User        @relation(fields: [authorId], references: [id])
  
  tags        BlogPostTag[]
  revisions   PostRevision[]
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([status, publishedAt])
  @@index([slug])
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

// 文章版本历史
model PostRevision {
  id        String   @id @default(cuid())
  postId    String
  post      BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  title     String
  content   String
  
  createdAt DateTime @default(now())
}

// 标签模型
model Tag {
  id          String        @id @default(cuid())
  name        String        @unique
  slug        String        @unique
  description String?
  
  posts       BlogPostTag[]
  
  @@index([slug])
}

// 文章-标签关联表
model BlogPostTag {
  postId String
  post   BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  tagId  String
  tag    Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
}

// 新闻模型
model News {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  content     String      // 正文内容
  excerpt     String      // 摘要
  coverImage  String?
  
  sourceUrl   String      // 原始链接
  sourceName  String      // 来源站点名称
  category    NewsCategory
  
  publishedAt DateTime    // 原始发布时间
  fetchedAt   DateTime    @default(now()) // 抓取时间
  
  viewCount   Int         @default(0)
  isFeatured  Boolean     @default(false)
  status      ContentStatus @default(PENDING)
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([category, publishedAt])
  @@index([status, fetchedAt])
  @@index([sourceUrl])
}

enum NewsCategory {
  AI          // 人工智能
  SPACE       // 宇宙航天
}

enum ContentStatus {
  PENDING     // 待审核
  APPROVED    // 已审核通过
  REJECTED    // 已拒绝
}

// RSS源配置模型
model RssSource {
  id            String      @id @default(cuid())
  name          String
  url           String      @unique
  category      NewsCategory
  
  isActive      Boolean     @default(true)
  lastFetchedAt DateTime?
  fetchInterval Int         @default(120) // 分钟
  
  // 额外配置（选择器、过滤规则等）
  config        Json?       @default("{}")
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

// 网站配置模型
model SiteConfig {
  id          String   @id @default(cuid())
  key         String   @unique
  value       Json
  
  updatedAt   DateTime @updatedAt
}
```

## Entity Details

### User (用户)
- **Purpose**: 博主和管理员账户
- **Key Fields**:
  - `role`: 区分管理员和编辑权限
  - `password`: bcrypt加密存储
- **Relationships**:
  - One-to-Many: User → BlogPost (一个作者多篇博文)

### BlogPost (博客文章)
- **Purpose**: 博主发布的个人文章
- **Key Fields**:
  - `slug`: URL友好的唯一标识
  - `content`: Markdown格式正文
  - `status`: 草稿/已发布状态
  - `publishedAt`: 计划发布或实际发布时间
- **Relationships**:
  - Many-to-One: BlogPost → User (作者)
  - Many-to-Many: BlogPost ↔ Tag (通过BlogPostTag)
  - One-to-Many: BlogPost → PostRevision (版本历史)

### Tag (标签)
- **Purpose**: 博客文章的灵活分类
- **Key Fields**:
  - `slug`: URL友好的唯一标识
- **Relationships**:
  - Many-to-Many: Tag ↔ BlogPost

### News (新闻)
- **Purpose**: 聚合的AI和航天新闻
- **Key Fields**:
  - `sourceUrl`: 原始文章链接（去重依据）
  - `category`: AI或SPACE分类
  - `status`: 审核状态
  - `fetchedAt`: 抓取时间
- **Indexes**:
  - 复合索引: (category, publishedAt) - 列表查询
  - 复合索引: (status, fetchedAt) - 后台审核查询

### RssSource (RSS源)
- **Purpose**: 配置新闻抓取的RSS源
- **Key Fields**:
  - `url`: RSS feed地址
  - `category`: 新闻分类
  - `fetchInterval`: 抓取间隔（分钟）
  - `config`: JSON配置（选择器、过滤等）

## Data Validation Rules

### BlogPost
- `title`: 必填, 1-200字符
- `slug`: 必填, 唯一, URL友好格式
- `content`: 必填, 最少10字符
- `publishedAt`: 发布状态时必须设置

### News
- `title`: 必填, 1-300字符
- `sourceUrl`: 必填, 唯一, 标准URL格式
- `category`: 必填, 只能是AI或SPACE

### User
- `email`: 必填, 唯一, 有效邮箱格式
- `password`: 必填, 最少8字符
- `role`: 必填, 只能是ADMIN或EDITOR

## State Transitions

### BlogPost Status
```
DRAFT ──publish()──> PUBLISHED
  ▲                    │
  └──unpublish()───────┘
```

### News Status
```
PENDING ──approve()──> APPROVED
   │
   └──reject()──> REJECTED
```

## Query Patterns

### 常见查询场景

1. **获取已发布的博客文章列表（分页）**
```typescript
prisma.blogPost.findMany({
  where: { status: 'PUBLISHED' },
  orderBy: { publishedAt: 'desc' },
  include: { author: true, tags: { include: { tag: true } } },
  skip: offset,
  take: limit
})
```

2. **获取分类新闻列表**
```typescript
prisma.news.findMany({
  where: { 
    category: 'AI',
    status: 'APPROVED'
  },
  orderBy: { publishedAt: 'desc' },
  take: 20
})
```

3. **根据标签搜索博客**
```typescript
prisma.blogPost.findMany({
  where: {
    status: 'PUBLISHED',
    tags: {
      some: { tag: { slug: 'typescript' } }
    }
  }
})
```

4. **全文搜索（PostgreSQL）**
```typescript
prisma.$queryRaw`
  SELECT * FROM "BlogPost"
  WHERE to_tsvector('chinese', title || ' ' || content) 
    @@ plainto_tsquery('chinese', ${searchQuery})
`
```
