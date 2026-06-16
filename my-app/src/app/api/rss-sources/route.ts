import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const sources = await prisma.rssSource.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: sources });
  } catch (error) {
    console.error("Error fetching RSS sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSS sources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, category, fetchInterval = 120 } = body;

    if (!name || !url || !category) {
      return NextResponse.json(
        { error: "Name, URL and category are required" },
        { status: 400 }
      );
    }

    const source = await prisma.rssSource.create({
      data: {
        name,
        url,
        category,
        fetchInterval,
      },
    });

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("Error creating RSS source:", error);
    return NextResponse.json(
      { error: "Failed to create RSS source" },
      { status: 500 }
    );
  }
}
