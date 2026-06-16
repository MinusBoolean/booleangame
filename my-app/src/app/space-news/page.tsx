import { Navbar } from "@/components/Navbar";
import { NewsList } from "@/components/news/NewsList";
import { prisma } from "@/lib/db";

export const revalidate = 60;

async function getSpaceNews() {
  const news = await prisma.news.findMany({
    where: {
      category: "SPACE",
      status: "APPROVED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 20,
  });
  return news;
}

export default async function SpaceNewsPage() {
  const news = await getSpaceNews();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">宇宙航天新闻</h1>
          <p className="text-muted-foreground">
            探索宇宙奥秘，SpaceX、NASA、中国航天最新发射任务
          </p>
        </div>
        <NewsList news={news} />
      </main>
    </div>
  );
}
