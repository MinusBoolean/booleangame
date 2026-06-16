"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface News {
  id: string;
  title: string;
  category: string;
  sourceName: string;
  status: string;
  publishedAt: string;
  fetchedAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news?limit=100");
      const data = await response.json();
      setNews(data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (response.ok) {
        fetchNews();
      } else {
        alert("操作失败");
      }
    } catch (error) {
      console.error("Error approving news:", error);
      alert("操作失败");
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">新闻管理</h1>
        <Button onClick={fetchNews}>刷新</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新闻列表</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>加载中...</p>
          ) : news.length === 0 ? (
            <p>暂无新闻</p>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Badge variant="outline">{item.category}</Badge>
                      <span>{item.sourceName}</span>
                      <span>{formatDate(item.fetchedAt)}</span>
                      <Badge
                        variant={
                          item.status === "APPROVED" ? "default" : "secondary"
                        }
                      >
                        {item.status === "APPROVED" ? "已通过" : "待审核"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {item.status !== "APPROVED" && (
                      <Button
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                      >
                        通过
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
