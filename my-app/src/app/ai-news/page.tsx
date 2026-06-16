import { Navbar } from "@/components/Navbar";
import { NewsList } from "@/components/news/NewsList";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getAINews() {
  const news = await prisma.news.findMany({
    where: {
      category: "AI",
      status: "APPROVED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 20,
  });
  return news;
}

export default async function AINewsPage() {
  const news = await getAINews();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">人工智能新闻</h1>
          <p className="text-muted-foreground">
            追踪AI技术最新突破，深度学习、大模型、AGI前沿资讯
          </p>
        </div>
        <NewsList news={news} />
      </main>
    </div>
  );
}
