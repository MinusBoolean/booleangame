import { Navbar } from "@/components/Navbar";
import { BlogList } from "@/components/blog/BlogList";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const revalidate = 60;

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
    take: 20,
  });
  return posts;
}

async function getTags() {
  const tags = await prisma.tag.findMany({
    take: 10,
  });
  return tags;
}

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getBlogPosts(), getTags()]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">个人博客</h1>
          <p className="text-muted-foreground">
            技术分享、读书笔记、生活随笔，记录成长与思考
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/blog">
            <Badge variant="default" className="cursor-pointer">
              全部
            </Badge>
          </Link>
          {tags.map((tag) => (
            <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
              <Badge variant="outline" className="cursor-pointer">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>

        <BlogList posts={posts} />
      </main>
    </div>
  );
}
