import Parser from "rss-parser";

const parser = new Parser();

export interface RSSItem {
  title: string;
  link: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
}

export interface RSSFeed {
  title?: string;
  description?: string;
  items: RSSItem[];
}

export async function parseRSSFeed(url: string): Promise<RSSFeed> {
  try {
    const feed = await parser.parseURL(url);
    return {
      title: feed.title,
      description: feed.description,
      items: feed.items.map((item) => ({
        title: item.title || "",
        link: item.link || "",
        content: item["content:encoded"] || item.content,
        contentSnippet: item.contentSnippet,
        pubDate: item.pubDate,
        isoDate: item.isoDate,
      })),
    };
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error);
    throw error;
  }
}

export function generateSlug(title: string): string {
  const timestamp = Date.now().toString(36);
  const slugBase = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
  return `${slugBase}-${timestamp}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}
