# Research Notes: 个人博客与新闻平台

**Created**: 2025-06-16

## RSS/News Aggregation Research

### RSS Feed Sources

#### 人工智能领域
- **机器之心**: RSS源稳定，中文AI新闻权威
- **量子位**: 科技新闻聚合，AI板块内容丰富
- **Synced(机器之心英文)**: 英文AI资讯
- **Paper Digest**: 论文解读和AI进展
- **MIT Technology Review AI**: 深度技术分析

#### 宇宙航天领域
- **NASA官方**: nasa.gov/news/releases 提供官方RSS
- **Space.com**: 航天新闻聚合
- **SpaceNews**: 商业航天资讯
- **国家航天局**: 中文官方航天新闻
- **ESA (欧洲航天局)**: 国际航天动态

### RSS抓取策略

**Decision**: 使用 rss-parser + node-cron 实现定时抓取

**Rationale**:
- rss-parser: 轻量级，支持标准RSS/Atom格式
- node-cron: 简单的Node.js定时任务调度
- 抓取频率: 每2小时一次，避免频繁请求被封
- 去重策略: 基于文章链接URL去重

**Alternatives considered**:
- Puppeteer: 过重，适合需要JS渲染的页面
- Feedbin API: 需要付费，增加外部依赖
- 自建RSSHub: 维护成本高

## Content Management Research

### 富文本编辑器选择

**Decision**: 使用 react-markdown + 自定义Markdown编辑器

**Rationale**:
- Markdown是技术写作的通用格式
- react-markdown支持自定义组件渲染
- 代码高亮通过 react-syntax-highlighter 实现
- 图片上传通过自定义组件集成

**Features supported**:
- 基础Markdown语法（标题、列表、链接、图片）
- 代码块 + 语法高亮
- 数学公式（KaTeX）
- 表格
- 任务列表

**Alternatives considered**:
- TipTap/ProseMirror: 功能强大但学习曲线陡峭
- Editor.js: 块级编辑器，不符合写作习惯
- TinyMCE: 过于商业化

### 图片处理

**Decision**: 使用 Sharp + Next.js Image Optimization

**Rationale**:
- Sharp: Node.js高性能图片处理
- Next.js Image: 自动优化、懒加载、响应式
- 支持WebP自动转换

## Database Schema Research

**Decision**: PostgreSQL + Prisma ORM

**Rationale**:
- PostgreSQL: 强大的全文搜索支持（中文）
- JSONB字段支持灵活的元数据存储
- Prisma提供类型安全的数据库访问

**Key features**:
- 文章搜索使用 PostgreSQL full-text search
- 标签系统使用多对多关系
- RSS源配置使用JSONB存储额外配置

## Authentication Research

**Decision**: NextAuth.js v5 (Auth.js)

**Rationale**:
- 与Next.js深度集成
- 支持多种登录方式（Credentials, OAuth）
- 会话管理完善
- 支持JWT和数据库会话

**Implementation**:
- 博主和管理员使用Credentials登录
- 密码使用 bcrypt 加密存储
- 会话使用JWT存储在Cookie中

## Deployment Research

**Recommendation**: Vercel (前端) + Railway/Supabase (数据库)

**Rationale**:
- Vercel: Next.js原生支持，自动部署，全球CDN
- Railway: 简单的PostgreSQL托管，按量付费
- Supabase: PostgreSQL + 可选的额外功能

**Alternative**: 自托管 (Docker + VPS)
- 适合技术爱好者
- 完全控制环境
- 需要自行维护

## RSS抓取最佳实践

1. **频率控制**: 每2小时抓取一次，避免对源站造成压力
2. **User-Agent**: 使用明确的UA标识，包含联系邮箱
3. **ETag/Last-Modified**: 支持条件请求，减少带宽
4. **错误处理**: 失败重试3次，记录失败日志
5. **内容去重**: 基于URL去重，存储原始链接
6. **摘要生成**: 超过500字符自动截断生成摘要

## News Classification

**Decision**: 使用关键词匹配 + 源站分类

**Implementation**:
- AI新闻源专门标记
- 航天新闻源专门标记
- 支持手动调整分类

**Keywords for AI**:
- 人工智能、机器学习、深度学习、神经网络、大模型、LLM、ChatGPT、AI、Machine Learning

**Keywords for Space**:
- 航天、火箭、卫星、空间站、火星、月球、SpaceX、NASA、发射
