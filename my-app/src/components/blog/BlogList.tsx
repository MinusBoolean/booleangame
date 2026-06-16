import { BlogCard } from "./BlogCard";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage?: string | null;
  publishedAt: Date | null;
  tags: { tag: { name: string; slug: string } }[];
}

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">暂无博客文章</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
