"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "~/server/auth";
import { JournalService, type JournalEntry } from "~/lib/journal-service";

// Re-export the type for convenience
export type { JournalEntry };

/**
 * Retrieves all journal entries for the authenticated user
 */
export async function getJournalEntries(): Promise<{
  entries: JournalEntry[];
  error: boolean;
}> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  try {
    const entries = await JournalService.getEntries(session.user.email);
    return { entries, error: false };
  } catch (error) {
    console.error("Failed to get journal entries:", error);
    // Return empty array for graceful error handling
    return { entries: [], error: true };
  }
}

/**
 * Adds a new journal entry for the authenticated user
 */
export async function addJournalEntry(
  text: string,
  images: string[] = [],
): Promise<void> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  if (!text.trim()) {
    throw new Error("Entry text cannot be empty");
  }

  try {
    await JournalService.addEntry(session.user.email, text, images);
    revalidatePath("/journal");
  } catch (error) {
    console.error("Failed to add journal entry:", error);
    throw new Error("Failed to add journal entry. Please try again.");
  }
}

/**
 * Updates an existing journal entry for the authenticated user
 */
export async function updateJournalEntry(
  entryId: string,
  text: string,
): Promise<void> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  if (!text.trim()) {
    throw new Error("Entry text cannot be empty");
  }

  try {
    const updatedEntry = await JournalService.updateEntry(
      session.user.email,
      entryId,
      text,
    );

    if (!updatedEntry) {
      throw new Error("Entry not found");
    }

    revalidatePath("/journal");
  } catch (error) {
    console.error("Failed to update journal entry:", error);
    throw new Error("Failed to update journal entry. Please try again.");
  }
}

/**
 * Deletes a journal entry for the authenticated user
 */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  try {
    const deleted = await JournalService.deleteEntry(
      session.user.email,
      entryId,
    );

    if (!deleted) {
      throw new Error("Entry not found");
    }

    revalidatePath("/journal");
  } catch (error) {
    console.error("Failed to delete journal entry:", error);
    throw new Error("Failed to delete journal entry. Please try again.");
  }
}

/**
 * Adds images to an existing journal entry for the authenticated user
 */
export async function addImagesToJournalEntry(
  entryId: string,
  images: string[],
): Promise<void> {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  if (!images.length) {
    throw new Error("No images provided");
  }

  try {
    const updatedEntry = await JournalService.addImagesToEntry(
      session.user.email,
      entryId,
      images,
    );

    if (!updatedEntry) {
      throw new Error("Entry not found");
    }

    revalidatePath("/journal");
  } catch (error) {
    console.error("Failed to add images to journal entry:", error);
    throw new Error("Failed to add images to journal entry. Please try again.");
  }
}

/**
 * Gets the total count of journal entries for the authenticated user
 */
export async function getJournalEntriesCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.email) {
    return 0;
  }

  try {
    return await JournalService.getEntriesCount(session.user.email);
  } catch (error) {
    console.error("Failed to get journal entries count:", error);
    return 0;
  }
}
