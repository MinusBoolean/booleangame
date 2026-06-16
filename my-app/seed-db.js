const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    const adminPassword = await hash('admin123', 10)
    await prisma.$executeRaw`
      INSERT OR IGNORE INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
      VALUES ('admin1', 'admin@example.com', '管理员', ${adminPassword}, 'ADMIN', datetime('now'), datetime('now'))
    `

    const editorPassword = await hash('editor123', 10)
    await prisma.$executeRaw`
      INSERT OR IGNORE INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
      VALUES ('editor1', 'editor@example.com', '博主', ${editorPassword}, 'EDITOR', datetime('now'), datetime('now'))
    `

    const tags = [
      { id: 'tag1', name: 'TypeScript', slug: 'typescript' },
      { id: 'tag2', name: 'React', slug: 'react' },
      { id: 'tag3', name: 'Next.js', slug: 'nextjs' },
      { id: 'tag4', name: '人工智能', slug: 'ai' },
      { id: 'tag5', name: '读书笔记', slug: 'reading' },
    ]

    for (const tag of tags) {
      await prisma.$executeRaw`
        INSERT OR IGNORE INTO "Tag" ("id", "name", "slug", "createdAt", "updatedAt")
        VALUES (${tag.id}, ${tag.name}, ${tag.slug}, datetime('now'), datetime('now'))
      `
    }

    await prisma.$executeRaw`
      INSERT OR IGNORE INTO "BlogPost" ("id", "title", "slug", "content", "excerpt", "status", "publishedAt", "viewCount", "authorId", "createdAt", "updatedAt")
      VALUES ('post1', 'Hello World', 'hello-world', 'Welcome!', 'Welcome to my blog!', 'PUBLISHED', datetime('now'), 0, 'editor1', datetime('now'), datetime('now'))
    `

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
