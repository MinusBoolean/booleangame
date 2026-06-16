#!/bin/bash

echo "🚂 Railway PostgreSQL 数据库设置"
echo "================================="
echo ""
echo "步骤 1: 登录 Railway"
echo "--------------------"
railway login

echo ""
echo "步骤 2: 初始化项目"
echo "--------------------"
railway init --name blog-news-platform

echo ""
echo "步骤 3: 添加 PostgreSQL 数据库"
echo "-------------------------------"
railway add --database postgres

echo ""
echo "步骤 4: 获取数据库连接字符串"
echo "-----------------------------"
railway variables get DATABASE_URL

echo ""
echo "✅ 完成！"
echo ""
echo "请复制上面的 DATABASE_URL，然后："
echo "1. 访问 https://vercel.com/caiweihao-s-projects/my-app/settings/environment-variables"
echo "2. 添加 DATABASE_URL 环境变量"
echo "3. 重新部署项目"
