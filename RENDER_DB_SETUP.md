# Render PostgreSQL 设置指南

## 步骤 1: 创建数据库

1. 访问 https://dashboard.render.com
2. 用 GitHub 账号登录
3. 点击 "New" → "PostgreSQL"
4. 填写：
   - Name: `blog-news-db`
   - Database: `blognews`
   - User: `bloguser`
   - 其他保持默认
5. 点击 "Create Database"

## 步骤 2: 获取连接字符串

数据库创建后（约1-2分钟）：

1. 点击数据库进入详情页
2. 找到 "Connections" 部分
3. 复制 **External Database URL**：
   ```
   postgres://bloguser:password@host:5432/blognews
   ```

## 步骤 3: 配置到 Vercel

1. 访问 https://vercel.com/caiweihao-s-projects/my-app/settings/environment-variables
2. 添加环境变量：
   - **Name**: `DATABASE_URL`
   - **Value**: （刚才复制的 Render URL）
3. 再添加：
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: `random-secret-key-for-nextauth`
4. 点击 "Save"

## 步骤 4: 运行迁移

回到本地终端执行：

```bash
cd /home/caiweihao/booleangame/my-app

# 1. 设置环境变量
export DATABASE_URL="postgres://bloguser:password@host:5432/blognews"

# 2. 运行迁移
npx prisma migrate deploy

# 3. 执行种子脚本
npm run db:seed
```

## 步骤 5: 重新部署

```bash
vercel --prod
```

---

完成！网站应该可以正常访问了。
