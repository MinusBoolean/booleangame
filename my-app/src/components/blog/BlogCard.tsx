import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage?: string | null;
    publishedAt: Date | null;
    tags: { tag: { name: string; slug: string } }[];
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {post.excerpt || "暂无摘要"}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <Badge key={tag.slug} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
          {post.publishedAt && (
            <p className="text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
