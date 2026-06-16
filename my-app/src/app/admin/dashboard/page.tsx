"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">管理后台</h1>
        <Button variant="outline" onClick={() => signOut()}>
          退出登录
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/admin/posts">
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardHeader>
              <CardTitle>博客管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                创建、编辑和管理博客文章
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/news">
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardHeader>
              <CardTitle>新闻管理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                审核和管理抓取的新闻内容
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="cursor-pointer hover:bg-muted/50">
            <CardHeader>
              <CardTitle>系统设置</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                配置 RSS 源和其他设置
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">返回首页</Button>
        </Link>
      </div>
    </div>
  );
}
