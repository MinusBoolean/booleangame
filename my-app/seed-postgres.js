const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const { hash } = require('bcryptjs')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const adminPassword = await hash('admin123', 10)
    await prisma.$executeRaw`
      INSERT INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
      VALUES ('admin1', 'admin@example.com', '管理员', ${adminPassword}, 'ADMIN', NOW(), NOW())
      ON CONFLICT ("id") DO NOTHING
    `

    const editorPassword = await hash('editor123', 10)
    await prisma.$executeRaw`
      INSERT INTO "User" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
      VALUES ('editor1', 'editor@example.com', '博主', ${editorPassword}, 'EDITOR', NOW(), NOW())
      ON CONFLICT ("id") DO NOTHING
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
        INSERT INTO "Tag" ("id", "name", "slug")
        VALUES (${tag.id}, ${tag.name}, ${tag.slug})
        ON CONFLICT ("id") DO NOTHING
      `
    }

    await prisma.$executeRaw`
      INSERT INTO "BlogPost" ("id", "title", "slug", "content", "excerpt", "status", "publishedAt", "viewCount", "authorId", "createdAt", "updatedAt")
      VALUES ('post1', 'Hello World', 'hello-world', 'Welcome!', 'Welcome to my blog!', 'PUBLISHED', NOW(), 0, 'editor1', NOW(), NOW())
      ON CONFLICT ("id") DO NOTHING
    `

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
