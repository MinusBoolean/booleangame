# Vercel 部署指南

## 前置要求

- GitHub 账号
- Vercel 账号 (可使用 GitHub 登录)
- PostgreSQL 数据库 (推荐使用 Vercel Postgres 或 Supabase)

## 部署步骤

### 1. 推送代码到 GitHub

```bash
git add -A
git commit -m "Prepare for Vercel deployment"
git push origin 001-blog-news-platform
```

### 2. 创建 Vercel 项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Add New Project"
3. 导入 `MinusBoolean/booleangame` 仓库
4. 选择 `my-app` 目录作为根目录
5. 框架预设选择 "Next.js"

### 3. 配置环境变量

在 Vercel 项目设置中，添加以下环境变量：

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=https://your-project.vercel.app
```

生成 NEXTAUTH_SECRET：
```bash
openssl rand -base64 32
```

### 4. 数据库设置

#### 选项 A: Vercel Postgres (推荐)

1. 在 Vercel Dashboard 中点击 "Storage"
2. 创建新的 Postgres 数据库
3. 连接到你的项目
4. 环境变量会自动配置

#### 选项 B: Supabase

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取 Connection String
4. 添加到 Vercel 环境变量

### 5. 数据库迁移

在 Vercel 部署完成后，运行迁移：

```bash
# 本地运行迁移
npx prisma migrate deploy

# 或者使用 Vercel CLI
vercel --prod
```

### 6. 执行种子脚本

```bash
# 本地执行种子
npm run db:seed
```

## 自动部署

每次推送到 `main` 分支，Vercel 会自动重新部署。

## 自定义域名 (可选)

1. 在 Vercel 项目设置中选择 "Domains"
2. 添加你的域名
3. 按照提示配置 DNS

## 故障排除

### 构建失败

检查构建日志，常见问题：
- 依赖安装失败 → 清除缓存重新部署
- 类型错误 → 本地运行 `npm run build` 检查

### 数据库连接失败

- 检查 DATABASE_URL 格式
- 确认数据库允许外部连接
- 检查防火墙设置

### RSS 抓取不工作

- 检查 CRON_SECRET 环境变量
- 查看 Vercel Functions 日志

## 监控

- 使用 Vercel Analytics 监控性能
- 使用 Vercel Logs 查看实时日志
