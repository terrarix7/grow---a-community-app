import { Redis } from "@upstash/redis";
import { z } from "zod";

const redis = Redis.fromEnv();

// Validation schemas
export const JournalEntrySchema = z.object({
  id: z.string(),
  dateTime: z.string(),
  text: z.string().min(1, "Entry text cannot be empty"),
  images: z.array(z.string().url()).optional().default([]),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;

const JournalEntriesSchema = z.array(JournalEntrySchema);

export class JournalService {
  private static readonly REDIS_KEY_PREFIX = "journal";

  private static getRedisKey(userEmail: string): string {
    return `${this.REDIS_KEY_PREFIX}:${userEmail}`;
  }

  /**
   * Retrieves all journal entries for a user
   */
  static async getEntries(userEmail: string): Promise<JournalEntry[]> {
    try {
      const redisKey = this.getRedisKey(userEmail);
      const rawData = await redis.get(redisKey);

      if (!rawData) {
        return [];
      }

      // Parse and validate the data
      let entries: unknown;
      if (typeof rawData === "string") {
        entries = JSON.parse(rawData);
      } else {
        entries = rawData;
      }

      // Validate the structure
      const validatedEntries = JournalEntriesSchema.parse(entries);

      // Sort by date (newest first for better UX)
      return validatedEntries.sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
      );
    } catch (error) {
      console.error("Failed to retrieve journal entries:", error);
      // Return empty array instead of throwing to handle gracefully
      return [];
    }
  }

  /**
   * Adds a new journal entry
   */
  static async addEntry(
    userEmail: string,
    text: string,
    images: string[] = [],
  ): Promise<JournalEntry> {
    try {
      // Validate input
      if (!text.trim()) {
        throw new Error("Entry text cannot be empty");
      }

      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        dateTime: new Date().toISOString(),
        text: text.trim(),
        images: images,
      };

      // Validate the new entry
      JournalEntrySchema.parse(newEntry);

      // Get existing entries
      const existingEntries = await this.getEntries(userEmail);

      // Add new entry at the beginning (newest first)
      const updatedEntries = [newEntry, ...existingEntries];

      // Store back to Redis
      const redisKey = this.getRedisKey(userEmail);
      await redis.set(redisKey, JSON.stringify(updatedEntries));

      return newEntry;
    } catch (error) {
      console.error("Failed to add journal entry:", error);
      throw new Error("Failed to add journal entry");
    }
  }

  /**
   * Updates an existing journal entry
   */
  static async updateEntry(
    userEmail: string,
    entryId: string,
    text: string,
  ): Promise<JournalEntry | null> {
    try {
      const entries = await this.getEntries(userEmail);
      const entryIndex = entries.findIndex((entry) => entry.id === entryId);

      if (entryIndex === -1) {
        return null;
      }

      const existingEntry = entries[entryIndex]!;
      const updatedEntry: JournalEntry = {
        id: existingEntry.id,
        dateTime: existingEntry.dateTime,
        text: text.trim(),
        images: existingEntry.images || [],
      };

      // Validate the updated entry
      JournalEntrySchema.parse(updatedEntry);

      entries[entryIndex] = updatedEntry;

      const redisKey = this.getRedisKey(userEmail);
      await redis.set(redisKey, JSON.stringify(entries));

      return updatedEntry;
    } catch (error) {
      console.error("Failed to update journal entry:", error);
      throw new Error("Failed to update journal entry");
    }
  }

  /**
   * Deletes a journal entry
   */
  static async deleteEntry(
    userEmail: string,
    entryId: string,
  ): Promise<boolean> {
    try {
      const entries = await this.getEntries(userEmail);
      const filteredEntries = entries.filter((entry) => entry.id !== entryId);

      if (filteredEntries.length === entries.length) {
        return false; // Entry not found
      }

      const redisKey = this.getRedisKey(userEmail);
      await redis.set(redisKey, JSON.stringify(filteredEntries));

      return true;
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
      throw new Error("Failed to delete journal entry");
    }
  }

  /**
   * Adds images to an existing journal entry
   */
  static async addImagesToEntry(
    userEmail: string,
    entryId: string,
    newImages: string[],
  ): Promise<JournalEntry | null> {
    try {
      const entries = await this.getEntries(userEmail);
      const entryIndex = entries.findIndex((entry) => entry.id === entryId);

      if (entryIndex === -1) {
        return null;
      }

      const existingEntry = entries[entryIndex]!;
      const updatedEntry: JournalEntry = {
        ...existingEntry,
        images: [...(existingEntry.images || []), ...newImages],
      };

      // Validate the updated entry
      JournalEntrySchema.parse(updatedEntry);

      entries[entryIndex] = updatedEntry;

      const redisKey = this.getRedisKey(userEmail);
      await redis.set(redisKey, JSON.stringify(entries));

      return updatedEntry;
    } catch (error) {
      console.error("Failed to add images to journal entry:", error);
      throw new Error("Failed to add images to journal entry");
    }
  }

  /**
   * Gets entries count for a user
   */
  static async getEntriesCount(userEmail: string): Promise<number> {
    try {
      const entries = await this.getEntries(userEmail);
      return entries.length;
    } catch (error) {
      console.error("Failed to get entries count:", error);
      return 0;
    }
  }
}
