import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({} as any);

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "管理员",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create editor user
  const editorPassword = await hash("editor123", 10);
  const editor = await prisma.user.upsert({
    where: { email: "editor@example.com" },
    update: {},
    create: {
      email: "editor@example.com",
      name: "博主",
      password: editorPassword,
      role: "EDITOR",
    },
  });

  // Create sample RSS sources
  const rssSources = [
    {
      name: "机器之心",
      url: "https://www.jiqizhixin.com/rss",
      category: "AI" as const,
    },
    {
      name: "量子位",
      url: "https://www.qbitai.com/rss",
      category: "AI" as const,
    },
    {
      name: "Space.com",
      url: "https://www.space.com/feeds/all",
      category: "SPACE" as const,
    },
  ];

  for (const source of rssSources) {
    await prisma.rssSource.upsert({
      where: { url: source.url },
      update: {},
      create: source,
    });
  }

  // Create sample tags
  const tags = [
    { name: "TypeScript", slug: "typescript", description: "TypeScript编程" },
    { name: "React", slug: "react", description: "React开发" },
    { name: "Next.js", slug: "nextjs", description: "Next.js框架" },
    { name: "人工智能", slug: "ai", description: "AI技术" },
    { name: "读书笔记", slug: "reading", description: "阅读笔记" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  // Create sample blog post
  const samplePost = await prisma.blogPost.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "Hello World - 欢迎来到我的博客",
      slug: "hello-world",
      content: `# Hello World

欢迎来到我的个人博客！这里将分享技术文章、读书笔记、生活随笔等内容。

## 关于这个博客

这个博客使用 Next.js + Prisma + PostgreSQL 构建，支持：

- Markdown 内容编辑
- 标签分类
- RSS 自动抓取新闻
- 响应式设计

## 技术栈

- **前端**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **后端**: Next.js API Routes, Prisma ORM
- **数据库**: PostgreSQL
- **部署**: Vercel

感谢你的访问！`,
      excerpt: "欢迎来到我的个人博客！这里将分享技术文章、读书笔记、生活随笔等内容。",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: editor.id,
    },
  });

  // Link post to tags
  const tsTag = await prisma.tag.findUnique({ where: { slug: "typescript" } });
  const reactTag = await prisma.tag.findUnique({ where: { slug: "react" } });
  const nextjsTag = await prisma.tag.findUnique({ where: { slug: "nextjs" } });

  if (tsTag && reactTag && nextjsTag) {
    await prisma.blogPostTag.upsert({
      where: { postId_tagId: { postId: samplePost.id, tagId: tsTag.id } },
      update: {},
      create: { postId: samplePost.id, tagId: tsTag.id },
    });
    await prisma.blogPostTag.upsert({
      where: { postId_tagId: { postId: samplePost.id, tagId: reactTag.id } },
      update: {},
      create: { postId: samplePost.id, tagId: reactTag.id },
    });
    await prisma.blogPostTag.upsert({
      where: { postId_tagId: { postId: samplePost.id, tagId: nextjsTag.id } },
      update: {},
      create: { postId: samplePost.id, tagId: nextjsTag.id },
    });
  }

  console.log("Seed completed:");
  console.log(`- Admin user: ${admin.email}`);
  console.log(`- Editor user: ${editor.email}`);
  console.log(`- RSS sources: ${rssSources.length}`);
  console.log(`- Tags: ${tags.length}`);
  console.log(`- Sample post: ${samplePost.title}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
