import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const news = await prisma.news.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news status:", error);
    return NextResponse.json(
      { error: "Failed to update news status" },
      { status: 500 }
    );
  }
}
