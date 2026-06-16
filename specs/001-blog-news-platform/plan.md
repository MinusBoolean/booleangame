# Implementation Plan: 个人博客与新闻平台

**Branch**: `001-blog-news-platform` | **Date**: 2025-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-blog-news-platform/spec.md`

## Summary

构建一个集个人博客与AI/航天新闻聚合于一体的内容平台。前端采用Next.js提供SSR和良好SEO，后端使用Next.js API Routes配合PostgreSQL数据库。新闻内容通过RSS/API自动聚合，博客支持富文本编辑和灵活分类。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+

**Primary Dependencies**: 
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Prisma ORM
- NextAuth.js (认证)
- react-markdown + react-syntax-highlighter (富文本渲染)

**Storage**: PostgreSQL 15+, 本地文件系统（图片上传）

**Testing**: Vitest (单元测试), Playwright (E2E测试)

**Target Platform**: Web (Modern Browsers), Responsive Design

**Project Type**: Web application with admin dashboard

**Performance Goals**: 
- 首屏加载 < 1.5s
- 新闻列表页加载 < 2s
- API响应时间 < 200ms (p95)

**Constraints**: 
- 支持中文内容搜索
- 图片懒加载优化
- RSS抓取频率限制（避免被封）

**Scale/Scope**: 
- 初期支持 1000+ 篇文章
- 日活跃用户 100+
- RSS源 10-20个

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

当前项目为Web应用，采用前后端一体架构（Next.js），符合现代Web开发最佳实践。暂无违反核心原则的情况。

## Project Structure

### Documentation (this feature)

```text
specs/001-blog-news-platform/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
my-app/                          # Next.js 项目根目录
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (site)/              # 前台页面组
│   │   │   ├── page.tsx         # 首页
│   │   │   ├── ai-news/         # 人工智能新闻
│   │   │   ├── space-news/      # 宇宙航天新闻
│   │   │   ├── blog/            # 博客列表
│   │   │   └── layout.tsx       # 前台布局
│   │   ├── (admin)/             # 管理后台组
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/   # 仪表盘
│   │   │   │   ├── posts/       # 文章管理
│   │   │   │   ├── news/        # 新闻管理
│   │   │   │   └── settings/    # 系统设置
│   │   │   └── layout.tsx       # 后台布局
│   │   ├── api/                 # API路由
│   │   │   ├── auth/            # 认证相关
│   │   │   ├── posts/           # 博客文章API
│   │   │   ├── news/            # 新闻API
│   │   │   └── rss/             # RSS抓取API
│   │   └── layout.tsx           # 根布局
│   ├── components/              # 共享组件
│   │   ├── ui/                  # 基础UI组件
│   │   ├── news/                # 新闻相关组件
│   │   ├── blog/                # 博客相关组件
│   │   └── admin/               # 后台组件
│   ├── lib/                     # 工具函数
│   │   ├── db.ts                # 数据库连接
│   │   ├── rss.ts               # RSS抓取逻辑
│   │   ├── auth.ts              # 认证配置
│   │   └── utils.ts             # 通用工具
│   ├── hooks/                   # React Hooks
│   ├── types/                   # TypeScript类型
│   └── styles/                  # 全局样式
├── prisma/
│   └── schema.prisma            # 数据库模型
├── public/                      # 静态资源
│   └── uploads/                 # 上传文件
├── scripts/
│   └── rss-crawler.ts           # RSS定时抓取脚本
├── tests/
│   ├── unit/                    # 单元测试
│   └── e2e/                     # E2E测试
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

**Structure Decision**: 采用Next.js 14 App Router的单体架构，前后端代码在同一项目中。使用Route Groups (`(site)`和`(admin)`)区分前台和后台路由。数据库使用Prisma ORM管理。

## Technology Stack Rationale

### 前端
- **Next.js 14**: 提供SSR/SSG、API Routes、Image Optimization等开箱即用功能
- **Tailwind CSS**: 快速构建响应式UI，减少CSS维护成本
- **shadcn/ui**: 基于Radix UI的高质量组件库

### 后端
- **Next.js API Routes**: 与前端共享代码，简化部署
- **Prisma**: 类型安全的数据库访问，迁移管理
- **NextAuth.js**: 完善的认证解决方案

### 数据抓取
- **rss-parser**: 解析RSS订阅源
- **node-cron**: 定时任务调度
- **cheerio**: HTML内容提取和清洗

### 内容处理
- **react-markdown**: Markdown渲染
- **react-syntax-highlighter**: 代码高亮
- **sharp**: 图片处理优化

## Complexity Tracking

暂无需要特别说明的复杂度问题。项目采用成熟技术栈，架构清晰。
