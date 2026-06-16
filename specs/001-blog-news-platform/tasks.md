# Tasks: 个人博客与新闻平台

**Input**: Design documents from `/specs/001-blog-news-platform/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js 14 project with TypeScript and Tailwind CSS in `my-app/`
- [ ] T002 [P] Install and configure shadcn/ui components in `my-app/components/ui/`
- [ ] T003 [P] Configure ESLint, Prettier, and TypeScript strict mode in config files
- [ ] T004 Setup project directory structure per plan.md (src/app/, src/components/, etc.)
- [ ] T005 Initialize Git repository and create initial commit

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup
- [ ] T006 Setup PostgreSQL connection and Prisma configuration in `src/lib/db.ts`
- [ ] T007 Create Prisma schema with all entities from data-model.md in `prisma/schema.prisma`
- [ ] T008 Run initial Prisma migration and generate client
- [ ] T009 Create database seed script in `prisma/seed.ts`

### Authentication
- [ ] T010 [P] Configure NextAuth.js with credentials provider in `src/lib/auth.ts`
- [ ] T011 [P] Create login page in `src/app/(admin)/login/page.tsx`
- [ ] T012 [P] Create admin layout with auth guard in `src/app/(admin)/layout.tsx`

### Core Components
- [ ] T013 [P] Create shared UI components (Button, Card, Input, etc.) in `src/components/ui/`
- [ ] T014 [P] Create site layout and navigation in `src/app/(site)/layout.tsx`
- [ ] T015 [P] Setup Tailwind theme configuration in `tailwind.config.ts`

### API Foundation
- [ ] T016 Create API response utilities in `src/lib/api.ts`
- [ ] T017 Setup error handling middleware pattern

**Checkpoint**: Foundation ready - database connected, auth working, base components ready. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - 浏览人工智能新闻 (Priority: P1) 🎯 MVP

**Goal**: 用户可以浏览和阅读人工智能分类的新闻内容

**Independent Test**: 访问首页，点击"人工智能"分类，能看到新闻列表，点击新闻能查看详情

### Models
- [ ] T018 [P] [US1] Create News model migration for AI news support in Prisma
- [ ] T019 [P] [US1] Create RssSource model migration in Prisma

### API
- [ ] T020 [US1] Implement GET /api/news endpoint with category filter in `src/app/api/news/route.ts`
- [ ] T021 [US1] Implement GET /api/news/:slug endpoint in `src/app/api/news/[slug]/route.ts`

### Frontend
- [ ] T022 [P] [US1] Create NewsCard component in `src/components/news/NewsCard.tsx`
- [ ] T023 [P] [US1] Create NewsList component in `src/components/news/NewsList.tsx`
- [ ] T024 [US1] Create AI news listing page in `src/app/(site)/ai-news/page.tsx`
- [ ] T025 [US1] Create news detail page in `src/app/(site)/ai-news/[slug]/page.tsx`
- [ ] T026 [US1] Add AI news link to main navigation

### RSS Crawler (Minimal)
- [ ] T027 [US1] Create basic RSS parser utility in `src/lib/rss.ts`
- [ ] T028 [US1] Create manual RSS crawl API endpoint in `src/app/api/cron/rss/route.ts`
- [ ] T029 [US1] Add sample AI RSS source to database

**Checkpoint**: User Story 1 complete - can browse AI news, view details, RSS crawler functional

---

## Phase 4: User Story 2 - 浏览宇宙航天新闻 (Priority: P1)

**Goal**: 用户可以浏览和阅读宇宙航天分类的新闻内容

**Independent Test**: 点击"宇宙航天"分类，能看到航天新闻列表，点击新闻能查看详情，与AI新闻独立

### API
- [ ] T030 [P] [US2] Extend GET /api/news to support SPACE category filter (update existing endpoint)
- [ ] T031 [P] [US2] Implement GET /api/news/:slug for space news (reuse existing endpoint)

### Frontend
- [ ] T032 [P] [US2] Create Space news listing page in `src/app/(site)/space-news/page.tsx`
- [ ] T033 [P] [US2] Create space news detail page (reuse NewsCard/NewsList components)
- [ ] T034 [US2] Add Space news link to main navigation

### RSS Crawler
- [ ] T035 [US2] Add sample Space RSS source to database
- [ ] T036 [US2] Update RSS crawler to categorize by source in `src/lib/rss.ts`

**Checkpoint**: User Story 2 complete - both AI and Space news work independently

---

## Phase 5: User Story 3 - 阅读个人博客文章 (Priority: P2)

**Goal**: 用户可以浏览和阅读博主的个人博客文章

**Independent Test**: 访问博客板块，能看到文章列表，支持按标签筛选，点击文章能查看完整内容

### Models
- [ ] T037 [P] [US3] Create BlogPost model migration in Prisma
- [ ] T038 [P] [US3] Create Tag model migration in Prisma
- [ ] T039 [P] [US3] Create BlogPostTag join table migration in Prisma

### API
- [ ] T040 [US3] Implement GET /api/posts endpoint with tag filter and search in `src/app/api/posts/route.ts`
- [ ] T041 [US3] Implement GET /api/posts/:slug endpoint in `src/app/api/posts/[slug]/route.ts`
- [ ] T042 [US3] Implement GET /api/tags endpoint in `src/app/api/tags/route.ts`

### Frontend
- [ ] T043 [P] [US3] Create BlogCard component in `src/components/blog/BlogCard.tsx`
- [ ] T044 [P] [US3] Create BlogList component in `src/components/blog/BlogList.tsx`
- [ ] T045 [P] [US3] Create Markdown content renderer in `src/components/blog/MarkdownContent.tsx`
- [ ] T046 [US3] Create blog listing page with tag filter in `src/app/(site)/blog/page.tsx`
- [ ] T047 [US3] Create blog detail page in `src/app/(site)/blog/[slug]/page.tsx`
- [ ] T048 [US3] Add blog link to main navigation

**Checkpoint**: User Story 3 complete - blog reading functional with tag filtering

---

## Phase 6: User Story 4 - 博主管理博客内容 (Priority: P2)

**Goal**: 博主可以创建、编辑、发布和管理博客文章

**Independent Test**: 登录后台，能创建文章、保存草稿、发布、编辑已有文章

### API
- [ ] T049 [P] [US4] Implement POST /api/posts endpoint in `src/app/api/posts/route.ts`
- [ ] T050 [P] [US4] Implement PUT /api/posts/:id endpoint in `src/app/api/posts/[id]/route.ts`
- [ ] T051 [P] [US4] Implement DELETE /api/posts/:id endpoint
- [ ] T052 [P] [US4] Implement POST /api/tags endpoint in `src/app/api/tags/route.ts`

### Admin Frontend
- [ ] T053 [P] [US4] Create admin dashboard layout in `src/app/(admin)/admin/layout.tsx`
- [ ] T054 [P] [US4] Create admin dashboard page in `src/app/(admin)/admin/dashboard/page.tsx`
- [ ] T055 [P] [US4] Create post list page in `src/app/(admin)/admin/posts/page.tsx`
- [ ] T056 [P] [US4] Create Markdown editor component in `src/components/admin/MarkdownEditor.tsx`
- [ ] T057 [US4] Create post editor page in `src/app/(admin)/admin/posts/new/page.tsx`
- [ ] T058 [US4] Create post edit page in `src/app/(admin)/admin/posts/[id]/edit/page.tsx`
- [ ] T059 [P] [US4] Create TagSelector component in `src/components/admin/TagSelector.tsx`
- [ ] T060 [US4] Create image upload component in `src/components/admin/ImageUpload.tsx`

### Post Revisions
- [ ] T061 [US4] Create PostRevision model in Prisma
- [ ] T062 [US4] Implement revision saving on post update in API

**Checkpoint**: User Story 4 complete - full blog management functional in admin

---

## Phase 7: User Story 5 - 新闻内容管理 (Priority: P3)

**Goal**: 管理员可以管理新闻内容、RSS源、审核抓取的新闻

**Independent Test**: 登录后台，能查看抓取的新闻、审核通过/拒绝、管理RSS源

### API
- [ ] T063 [P] [US5] Implement PUT /api/news/:id/status endpoint in `src/app/api/news/[id]/status/route.ts`
- [ ] T064 [P] [US5] Implement GET /api/rss-sources endpoint in `src/app/api/rss-sources/route.ts`
- [ ] T065 [P] [US5] Implement POST /api/rss-sources endpoint
- [ ] T066 [P] [US5] Implement PUT /api/rss-sources/:id endpoint
- [ ] T067 [P] [US5] Implement DELETE /api/rss-sources/:id endpoint

### Admin Frontend
- [ ] T068 [P] [US5] Create news management page in `src/app/(admin)/admin/news/page.tsx`
- [ ] T069 [P] [US5] Create RSS source management page in `src/app/(admin)/admin/settings/rss/page.tsx`
- [ ] T070 [US5] Create news detail review page in `src/app/(admin)/admin/news/[id]/page.tsx`

### RSS Management
- [ ] T071 [US5] Add RSS source form component in `src/components/admin/RssSourceForm.tsx`
- [ ] T072 [US5] Implement RSS source toggle (active/inactive) functionality

**Checkpoint**: User Story 5 complete - news management and RSS configuration functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Performance & UX
- [ ] T073 [P] Implement image optimization with Next.js Image component across all pages
- [ ] T074 [P] Add loading skeletons for news and blog lists
- [ ] T075 [P] Implement infinite scroll or pagination UI improvements
- [ ] T076 [P] Add SEO meta tags for all pages
- [ ] T077 Implement responsive mobile navigation

### Content Features
- [ ] T078 [P] Add syntax highlighting for code blocks in MarkdownContent
- [ ] T079 Add table of contents generation for blog posts
- [ ] T080 Implement related posts recommendation
- [ ] T081 Add view count tracking

### RSS Improvements
- [ ] T082 Implement automatic RSS crawling with Vercel Cron
- [ ] T083 Add RSS feed health monitoring
- [ ] T084 Implement content deduplication logic
- [ ] T085 Add automatic summarization for long articles

### Admin Improvements
- [ ] T086 Add post statistics dashboard
- [ ] T087 Implement bulk operations for news management
- [ ] T088 Add search functionality in admin post/news lists

### Documentation
- [ ] T089 Update README.md with project overview
- [ ] T090 Create .env.example file
- [ ] T091 Add deployment guide section

### Testing & Quality
- [ ] T092 [P] Add TypeScript strict type checking across all files
- [ ] T093 Add error boundary components
- [ ] T094 Implement form validation with Zod

**Checkpoint**: All polish items complete - production ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - Can proceed in parallel (if staffed) or sequentially in priority order
- **Phase 8 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Priority | Dependencies | Notes |
|-------|----------|--------------|-------|
| US1 - AI News | P1 | Phase 2 | Foundation required |
| US2 - Space News | P1 | Phase 2, US1 (minimal) | Reuses US1 components |
| US3 - Blog Reading | P2 | Phase 2 | Independent from news |
| US4 - Blog Management | P2 | Phase 2, US3 | Builds on blog models |
| US5 - News Management | P3 | Phase 2, US1 | Builds on news models |

### Within Each Phase

- Models before API endpoints
- API endpoints before frontend pages
- Components before page integration
- Core functionality before polish

### Parallel Opportunities

1. **Phase 1**: All tasks [P] can run in parallel
2. **Phase 2**: Database setup, Auth, Components can run in parallel
3. **After Phase 2**: US1, US3 can start immediately in parallel
4. **US1 complete**: US2 can start (builds on US1 components)
5. **US3 complete**: US4 can start (builds on blog models)
6. **US1 complete**: US5 can start (builds on news models)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (AI News)
4. **STOP and VALIDATE**: Test AI news browsing
5. Deploy MVP

### Incremental Delivery

```
Sprint 1: Setup + Foundational
Sprint 2: US1 (AI News) → Deploy MVP v0.1
Sprint 3: US2 (Space News) → Deploy v0.2
Sprint 4: US3 (Blog Reading) → Deploy v0.3
Sprint 5: US4 (Blog Management) → Deploy v0.4
Sprint 6: US5 (News Management) → Deploy v0.5
Sprint 7: Polish → Production v1.0
```

### Recommended Execution Order

Given single-developer context, recommended order:

1. **Phase 1-2**: Setup and Foundation (complete before any user story)
2. **Phase 3**: US1 - AI News (MVP - minimal viable product)
3. **Phase 4**: US2 - Space News (quick win, reuses US1 code)
4. **Phase 5**: US3 - Blog Reading (new feature area)
5. **Phase 6**: US4 - Blog Management (admin features)
6. **Phase 7**: US5 - News Management (admin features)
7. **Phase 8**: Polish (production readiness)

---

## Total Task Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1 | 5 | Project setup |
| Phase 2 | 12 | Foundation (database, auth, components) |
| Phase 3 | 12 | US1: AI News (MVP) |
| Phase 4 | 7 | US2: Space News |
| Phase 5 | 12 | US3: Blog Reading |
| Phase 6 | 14 | US4: Blog Management |
| Phase 7 | 10 | US5: News Management |
| Phase 8 | 22 | Polish & optimization |
| **Total** | **94** | |

**MVP Scope**: Phases 1-3 (29 tasks) - AI News functional and deployable
