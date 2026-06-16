import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseRSSFeed, generateSlug, truncateText } from "@/lib/rss";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sources = await prisma.rssSource.findMany({
      where: { isActive: true },
    });

    const results = {
      fetched: 0,
      new: 0,
      errors: [] as string[],
    };

    for (const source of sources) {
      try {
        const feed = await parseRSSFeed(source.url);
        results.fetched += feed.items.length;

        for (const item of feed.items.slice(0, 10)) {
          const existing = await prisma.news.findFirst({
            where: { sourceUrl: item.link },
          });

          if (existing) continue;

          const content = item.content || item.contentSnippet || "";
          const excerpt = truncateText(content.replace(/<[^>]*>/g, ""), 200);

          await prisma.news.create({
            data: {
              title: item.title || "Untitled",
              slug: generateSlug(item.title || "untitled"),
              content: content,
              excerpt: excerpt,
              sourceUrl: item.link || "",
              sourceName: source.name,
              category: source.category,
              publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
              status: "PENDING",
            },
          });

          results.new++;
        }

        await prisma.rssSource.update({
          where: { id: source.id },
          data: { lastFetchedAt: new Date() },
        });
      } catch (error) {
        const errorMsg = `Failed to fetch ${source.name}: ${error}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("RSS crawl error:", error);
    return NextResponse.json(
      { error: "Failed to crawl RSS feeds" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "RSS cron endpoint" });
}
