import { Navbar } from "@/components/Navbar";
import { SolarSystem } from "@/components/SolarSystem";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SolarSystem />
      <div className="relative z-10 bg-background/95 backdrop-blur-sm">
        <Navbar />
        <main className="flex-1">
          <section className="container py-12 md:py-24 lg:py-32">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                探索科技与宇宙的边界
              </h1>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                人工智能前沿动态 · 宇宙航天最新进展 · 个人技术博客
              </p>
            </div>
          </section>

          <section className="container py-12">
            <div className="grid gap-6 md:grid-cols-3">
              <Link href="/ai-news">
                <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">AI</Badge>
                    <CardTitle className="mt-2">人工智能</CardTitle>
                    <CardDescription>
                      追踪AI技术最新突破，深度学习、大模型、AGI前沿资讯
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">查看最新AI新闻 →</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/space-news">
                <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">Space</Badge>
                    <CardTitle className="mt-2">宇宙航天</CardTitle>
                    <CardDescription>
                      探索宇宙奥秘，SpaceX、NASA、中国航天最新发射任务
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">查看航天新闻 →</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/blog">
                <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <Badge className="w-fit" variant="secondary">Blog</Badge>
                    <CardTitle className="mt-2">个人博客</CardTitle>
                    <CardDescription>
                      技术分享、读书笔记、生活随笔，记录成长与思考
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">阅读博客文章 →</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              探索科技与宇宙的边界
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
