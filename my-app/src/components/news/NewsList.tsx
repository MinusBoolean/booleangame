import { NewsCard } from "./NewsCard";

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string | null;
  category: string;
  sourceName: string;
  publishedAt: Date;
}

interface NewsListProps {
  news: News[];
}

export function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">暂无新闻内容</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
