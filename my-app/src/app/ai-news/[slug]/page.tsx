import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getNewsBySlug(slug: string) {
  const news = await prisma.news.findUnique({
    where: { slug },
  });
  return news;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <p>新闻不存在</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 max-w-4xl">
        <Link
          href="/ai-news"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge>{news.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {news.sourceName}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time>{formatDate(news.publishedAt)}</time>
              <span>{news.viewCount} 阅读</span>
            </div>
          </header>

          <Card>
            <CardContent className="prose prose-slate max-w-none pt-6">
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              原文链接:{" "}
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {news.sourceUrl}
              </a>
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
