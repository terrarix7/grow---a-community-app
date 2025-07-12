"use client";

import React from "react";
import { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ImageGallery } from "~/components/image-gallery";
import { Camera, ArrowRight, Loader2 } from "lucide-react";

const STORAGE_KEY = "journal-entries";

export interface JournalEntry {
  id: string;
  dateTime: string;
  text: string;
  images?: string[];
}

const getEntriesFromStorage = (): JournalEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return [];
  }
};

const saveEntriesToStorage = (entries: JournalEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

function JournalLoading() {
  return (
    <div className="h-full space-y-0 overflow-y-auto p-6">
      {/* Loading skeleton for form */}
      <div className="mb-6">
        <div className="flex gap-6 rounded-lg p-3">
          <div className="w-20 flex-shrink-0">
            <div className="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="min-h-36 animate-pulse rounded bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded bg-gray-200"></div>
              <div className="h-10 w-10 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading skeleton for entries */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border-t border-gray-200 pt-6">
          <div className="mb-4">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-6 rounded-lg p-3">
              <div className="w-20 flex-shrink-0">
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-3/5 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedEntries = getEntriesFromStorage();
    setEntries(loadedEntries);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <JournalLoading />;
  }

  return <JournalForm entries={entries} setEntries={setEntries} />;
}

interface JournalFormProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

export function JournalForm({ entries, setEntries }: JournalFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  };

  // Group entries by date
  const groupedEntries = entries.reduce(
    (groups, entry) => {
      const date = new Date(entry.dateTime);
      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
      return groups;
    },
    {} as Record<string, JournalEntry[]>,
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const imagePromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`);
        }

        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error(`${file.name} is too large. Maximum size is 5MB`);
        }

        return await convertFileToBase64(file);
      });

      const base64Images = await Promise.all(imagePromises);
      setUploadedImages((prev) => [...prev, ...base64Images]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload images";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const entry = formData.get("entry") as string;

    // Client-side validation
    if (!entry?.trim()) {
      setError("Please enter some text for your journal entry");
      textareaRef.current?.focus();
      return;
    }

    // Clear any previous errors
    setError(null);
    setIsSubmitting(true);

    try {
      // Create new entry
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        dateTime: new Date().toISOString(),
        text: entry.trim(),
        images: uploadedImages,
      };

      // Add to beginning of entries array (newest first)
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);

      // Save to localStorage
      saveEntriesToStorage(updatedEntries);

      // Reset form
      formRef.current?.reset();
      setUploadedImages([]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add entry";
      setError(errorMessage);

      // Restore the text in the form if there was an error
      if (textareaRef.current) {
        textareaRef.current.value = entry;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full space-y-0 overflow-y-auto p-6">
      {/* Input form at the top */}
      <div className="mb-6">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex gap-6 rounded-lg p-3 transition-colors hover:bg-gray-50"
        >
          <div className="w-20 flex-shrink-0">
            <div className="text-xs text-gray-600">
              {getCurrentDateTime().time}
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <Textarea
                ref={textareaRef}
                name="entry"
                placeholder="What's on your mind today?"
                className="min-h-36 w-full resize-none border-2 border-gray-200 leading-relaxed text-gray-900 placeholder:text-gray-500 focus:ring-0 focus:outline-none focus-visible:border-gray-300 focus-visible:ring-0 dark:bg-transparent"
                disabled={isSubmitting}
                required
                minLength={1}
                maxLength={5000}
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = target.scrollHeight + "px";
                }}
              />

              {error && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Image previews */}
            {uploadedImages.length > 0 && (
              <div>
                <ImageGallery images={uploadedImages} />
                <button
                  type="button"
                  onClick={() => setUploadedImages([])}
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear images
                </button>
              </div>
            )}

            {/* Buttons at bottom left */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md border border-gray-300 bg-white p-3 text-gray-700 transition-colors hover:bg-gray-50"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>

              <Button
                type="submit"
                className="bg-gray-800 p-3 text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {entries.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-gray-500">No journal entries yet</p>
            <p className="mt-2 text-sm text-gray-400">
              Start writing your first entry above
            </p>
          </div>
        </div>
      ) : (
        Object.entries(groupedEntries).map(([dateKey, entries]) => (
          <div key={dateKey} className="border-t border-gray-200 pt-6">
            {/* Date header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{dateKey}</h3>
            </div>

            {/* Entries for this date */}
            <div className="space-y-4">
              {entries.map((entry) => {
                const time = new Date(entry.dateTime).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  },
                );

                return (
                  <div
                    key={entry.id}
                    className="flex gap-6 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="w-20 flex-shrink-0">
                      <div className="text-xs text-gray-600">{time}</div>
                    </div>
                    <div className="flex-1">
                      <p className="leading-relaxed whitespace-pre-wrap text-gray-900">
                        {entry.text}
                      </p>
                      <ImageGallery images={entry.images || []} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
