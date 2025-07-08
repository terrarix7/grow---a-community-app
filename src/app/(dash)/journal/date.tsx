"use client";

import React, { useOptimistic, useRef, useState, useTransition } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { UploadButton } from "~/lib/uploadthing";
import { ImageGallery } from "~/components/image-gallery";
import { Camera, ArrowRight, Loader2 } from "lucide-react";
import { addJournalEntry, type JournalEntry } from "./action";

interface ClientDateProps {
  dateTime: string;
}

function ClientDate({ dateTime }: ClientDateProps) {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="w-32 flex-shrink-0">
      <div className="text-sm font-medium text-gray-900">{formattedDate}</div>
      <div className="text-xs text-gray-600">{formattedTime}</div>
    </div>
  );
}

interface JournalFormProps {
  initialEntries: JournalEntry[];
}

export function JournalForm({ initialEntries }: JournalFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [optimisticEntries, addOptimisticEntry] = useOptimistic(
    initialEntries,
    (state, newEntry: JournalEntry) => [newEntry, ...state], // Add to beginning since we're sorting newest first
  );

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

  const handleSubmit = async (formData: FormData) => {
    const entry = formData.get("entry") as string;

    // Client-side validation
    if (!entry?.trim()) {
      setError("Please enter some text for your journal entry");
      textareaRef.current?.focus();
      return;
    }

    // Clear any previous errors
    setError(null);

    // Create optimistic entry
    const optimisticEntry: JournalEntry = {
      id: crypto.randomUUID(),
      dateTime: new Date().toISOString(),
      text: entry.trim(),
      images: uploadedImages,
    };

    // Start transition for better UX
    startTransition(async () => {
      try {
        // Add optimistic entry immediately
        addOptimisticEntry(optimisticEntry);

        // Reset form immediately for better UX
        formRef.current?.reset();

        // Submit to server
        await addJournalEntry(entry, uploadedImages);

        // Clear uploaded images after successful submission
        setUploadedImages([]);
      } catch (error) {
        // Handle error - in a real app you might want to remove the optimistic entry
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add entry";
        setError(errorMessage);

        // Restore the text in the form if there was an error
        if (textareaRef.current) {
          textareaRef.current.value = entry;
        }
      }
    });
  };

  return (
    <div className="relative h-full">
      <div className="h-full space-y-0 overflow-y-auto pb-[80vh]">
        {optimisticEntries.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-lg text-gray-500">No journal entries yet</p>
              <p className="mt-2 text-sm text-gray-400">
                Start writing your first entry below
              </p>
            </div>
          </div>
        ) : (
          optimisticEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-6 border-t border-b border-gray-200 p-6 transition-colors hover:bg-gray-50"
            >
              <ClientDate dateTime={entry.dateTime} />
              <div className="flex-1">
                <p className="leading-relaxed whitespace-pre-wrap text-gray-900">
                  {entry.text}
                </p>
                <ImageGallery images={entry.images || []} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fixed form at bottom */}
      <div className="fixed right-0 bottom-0 left-0 ml-[var(--sidebar-width-icon)] border-t border-gray-200 bg-white p-6 shadow-lg transition-[margin-left] duration-200 ease-linear group-data-[state=collapsed]/sidebar-wrapper:ml-[var(--sidebar-width-icon)]">
        <form ref={formRef} action={handleSubmit} className="flex gap-6">
          <div className="w-32 flex-shrink-0">
            <div className="text-sm font-medium text-gray-900">
              {getCurrentDateTime().date}
            </div>
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
                className="min-h-[100px] w-full resize-none border-gray-300 bg-white focus:border-gray-500 focus:ring-gray-200"
                disabled={isPending}
                required
                minLength={1}
                maxLength={5000}
              />

              {error && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              {/* Image previews on the left side */}
              <div className="flex-1">
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
              </div>

              {/* Buttons on the right side */}
              <div className="flex items-center gap-3">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const newImages = res.map((file) => file.url);
                    setUploadedImages((prev) => [...prev, ...newImages]);
                  }}
                  onUploadError={(error: Error) => {
                    setError(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 text-sm px-3 py-2 rounded-md transition-colors",
                    allowedContent: "hidden",
                  }}
                  content={{
                    button: (
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Add Images
                      </div>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  className="bg-gray-800 p-3 text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientDate;
