"use server";

import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Redis } from "@upstash/redis";
import { revalidatePath } from "next/cache";

const redis = Redis.fromEnv();

export type JournalEntry = {
  id: string;
  dateTime: string;
  text: string;
};

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const existingEntries = await redis.get(`journal:${session.user.id}`);

  let entries: JournalEntry[] = [];

  if (existingEntries) {
    // Handle both string and object responses from Redis
    if (typeof existingEntries === "string") {
      try {
        entries = JSON.parse(existingEntries);
      } catch (error) {
        console.error("Error parsing journal entries:", error);
        entries = [];
      }
    } else if (Array.isArray(existingEntries)) {
      entries = existingEntries;
    } else {
      console.error("Unexpected data type from Redis:", typeof existingEntries);
      entries = [];
    }
  }

  // Ensure all entries have required fields and add IDs if missing
  entries = entries.map((entry, index) => ({
    id: entry.id || `entry-${Date.now()}-${index}`,
    dateTime: entry.dateTime || new Date().toISOString(),
    text: entry.text || "",
  }));

  // Sort entries by date (oldest first)
  return entries.sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
  );
}

export async function addJournalEntry(entry: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const now = new Date();
  const currentDateTime = now.toISOString();

  // Get existing entries using the same method
  const existingEntries = await getJournalEntries();

  const newEntry: JournalEntry = {
    id: crypto.randomUUID(),
    dateTime: currentDateTime,
    text: entry,
  };

  const updatedEntries = [newEntry, ...existingEntries];

  // Store as JSON string
  await redis.set(`journal:${session.user.id}`, JSON.stringify(updatedEntries));

  // Revalidate the journal page to show fresh data
  revalidatePath("/journal");
}
