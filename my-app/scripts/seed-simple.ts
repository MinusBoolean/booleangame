import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理员',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const editorPassword = await hash('editor123', 10)
  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      email: 'editor@example.com',
      name: '博主',
      password: editorPassword,
      role: 'EDITOR',
    },
  })

  const tags = [
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: '人工智能', slug: 'ai' },
    { name: '读书笔记', slug: 'reading' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }

  await prisma.blogPost.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      title: 'Hello World',
      slug: 'hello-world',
      content: 'Welcome to my blog!',
      excerpt: 'Welcome!',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: editor.id,
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
