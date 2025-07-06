"use client";

import React, { useOptimistic, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { addJournalEntry, type JournalEntry } from "./action";

function ClientDate({ dateTime }: { dateTime: string }) {
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

export function JournalForm({
  initialEntries,
}: {
  initialEntries: JournalEntry[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [optimisticEntries, addOptimisticEntry] = useOptimistic(
    initialEntries,
    (state, newEntry: JournalEntry) => [newEntry, ...state],
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

  async function handleSubmit(formData: FormData) {
    const entry = formData.get("entry") as string;
    if (!entry.trim()) return;

    // Create optimistic entry
    const optimisticEntry: JournalEntry = {
      id: crypto.randomUUID(),
      dateTime: new Date().toISOString(),
      text: entry,
    };

    // Add optimistic entry immediately
    addOptimisticEntry(optimisticEntry);

    // Reset form
    formRef.current?.reset();

    // Submit to server
    await addJournalEntry(entry);
  }

  return (
    <div>
      <div className="space-y-0 pb-32">
        {optimisticEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex gap-6 border-t border-b border-gray-200 p-6"
          >
            <ClientDate dateTime={entry.dateTime} />
            <div className="flex-1">
              <p className="leading-relaxed text-gray-900">{entry.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed right-0 bottom-0 left-64 border-t border-gray-200 bg-white p-6">
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
            <Textarea
              name="entry"
              placeholder="What's on your mind today?"
              className="min-h-[100px] w-full resize-none border-gray-300 bg-white focus:border-gray-500 focus:ring-gray-200"
              required
            />
            <Button
              type="submit"
              className="bg-gray-800 text-white hover:bg-gray-900"
            >
              Add Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientDate;
