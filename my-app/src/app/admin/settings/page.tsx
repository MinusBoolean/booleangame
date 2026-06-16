"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">系统设置</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/settings/rss">
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardHeader>
              <CardTitle>RSS 源管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                配置和管理 RSS 新闻源
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/admin/dashboard">
          <Button variant="outline">返回仪表盘</Button>
        </Link>
      </div>
    </div>
  );
}
