import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// GET /api/images - Get all images for user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const images = (await redis.lrange(
      `images:${session.user.email}`,
      0,
      -1,
    )) as string[];

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}

// POST /api/images - Add images to user's collection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Images array is required" },
        { status: 400 },
      );
    }

    // Add images to user's collection
    const imageKey = `images:${session.user.email}`;

    for (const image of images) {
      if (typeof image === "string" && image.trim()) {
        await redis.lpush(imageKey, image);
      }
    }

    return NextResponse.json({ success: true, added: images.length });
  } catch (error) {
    console.error("Failed to add images:", error);
    return NextResponse.json(
      { error: "Failed to add images" },
      { status: 500 },
    );
  }
}

// DELETE /api/images - Remove images from user's collection
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Images array is required" },
        { status: 400 },
      );
    }

    // Remove images from user's collection
    const imageKey = `images:${session.user.email}`;
    let removedCount = 0;

    for (const image of images) {
      if (typeof image === "string" && image.trim()) {
        const removed = await redis.lrem(imageKey, 0, image);
        if (removed > 0) {
          removedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, removed: removedCount });
  } catch (error) {
    console.error("Failed to remove images:", error);
    return NextResponse.json(
      { error: "Failed to remove images" },
      { status: 500 },
    );
  }
}
