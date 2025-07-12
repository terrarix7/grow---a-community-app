import { NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { JournalService, type JournalEntry } from "~/lib/journal-service";

// GET /api/entries - Get all entries or count
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const count = searchParams.get("count");

    if (count === "true") {
      // Get entries count
      try {
        const totalCount = await JournalService.getEntriesCount(
          session.user.email,
        );
        return NextResponse.json({ count: totalCount });
      } catch (error) {
        console.error("Failed to get journal entries count:", error);
        return NextResponse.json({ count: 0 });
      }
    }

    // Get all entries
    try {
      const entries = await JournalService.getEntries(session.user.email);
      return NextResponse.json({ entries, error: false });
    } catch (error) {
      console.error("Failed to get journal entries:", error);
      return NextResponse.json({ entries: [], error: true });
    }
  } catch (error) {
    console.error("Failed to authenticate:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 },
    );
  }
}

// POST /api/entries - Create new entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, images = [] } = body;

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Entry text cannot be empty" },
        { status: 400 },
      );
    }

    try {
      await JournalService.addEntry(session.user.email, text, images);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to add journal entry:", error);
      return NextResponse.json(
        { error: "Failed to add journal entry. Please try again." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PUT /api/entries - Update entry
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { entryId, text } = body;

    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 },
      );
    }

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Entry text cannot be empty" },
        { status: 400 },
      );
    }

    try {
      const updatedEntry = await JournalService.updateEntry(
        session.user.email,
        entryId,
        text,
      );

      if (!updatedEntry) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to update journal entry:", error);
      return NextResponse.json(
        { error: "Failed to update journal entry. Please try again." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/entries - Delete entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { entryId } = body;

    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 },
      );
    }

    try {
      const deleted = await JournalService.deleteEntry(
        session.user.email,
        entryId,
      );

      if (!deleted) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
      return NextResponse.json(
        { error: "Failed to delete journal entry. Please try again." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PATCH /api/entries - Add images to entry
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { entryId, images } = body;

    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 },
      );
    }

    if (!images?.length) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 },
      );
    }

    try {
      const updatedEntry = await JournalService.addImagesToEntry(
        session.user.email,
        entryId,
        images,
      );

      if (!updatedEntry) {
        return NextResponse.json({ error: "Entry not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Failed to add images to journal entry:", error);
      return NextResponse.json(
        { error: "Failed to add images to journal entry. Please try again." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
