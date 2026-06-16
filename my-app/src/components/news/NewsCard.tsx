import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string | null;
    category: string;
    sourceName: string;
    publishedAt: Date;
  };
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/ai-news/${news.slug}`}>
      <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{news.category}</Badge>
            <span className="text-xs text-muted-foreground">{news.sourceName}</span>
          </div>
          <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {news.excerpt}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(news.publishedAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
