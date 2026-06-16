"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface RssSource {
  id: string;
  name: string;
  url: string;
  category: string;
  isActive: boolean;
  lastFetchedAt: string | null;
}

export default function RssSettingsPage() {
  const [sources, setSources] = useState<RssSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch("/api/rss-sources");
      const data = await response.json();
      setSources(data.data || []);
    } catch (error) {
      console.error("Error fetching RSS sources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/rss-sources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchSources();
      } else {
        alert("操作失败");
      }
    } catch (error) {
      console.error("Error toggling RSS source:", error);
      alert("操作失败");
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">RSS 源管理</h1>
        <Link href="/admin/settings">
          <Button variant="outline">返回设置</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>已配置的 RSS 源</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>加载中...</p>
          ) : sources.length === 0 ? (
            <p>暂无 RSS 源</p>
          ) : (
            <div className="space-y-4">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">{source.url}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <Badge variant="outline">{source.category}</Badge>
                      {source.lastFetchedAt && (
                        <span className="text-muted-foreground">
                          最后更新: {formatDate(source.lastFetchedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant={source.isActive ? "default" : "outline"}
                      onClick={() => handleToggle(source.id, source.isActive)}
                    >
                      {source.isActive ? "禁用" : "启用"}
                    </Button>
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
