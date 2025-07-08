import React, { Suspense } from "react";
import { getJournalEntries } from "./action";
import { JournalForm } from "./date";
import { ErrorReloadButton } from "./error-button";

function JournalLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-0 overflow-y-auto pb-32">
        {/* Loading skeleton for entries */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse gap-6 border-t border-b border-gray-200 p-6"
          >
            <div className="w-32 flex-shrink-0">
              <div className="mb-2 h-4 rounded bg-gray-200"></div>
              <div className="h-3 w-16 rounded bg-gray-200"></div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <div className="h-4 rounded bg-gray-200"></div>
                <div className="h-4 w-4/5 rounded bg-gray-200"></div>
                <div className="h-4 w-3/5 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading form at bottom */}
      <div className="fixed right-0 bottom-0 left-0 ml-[var(--sidebar-width)] border-t border-gray-200 bg-white p-6 shadow-lg transition-[margin-left] duration-200 ease-linear group-data-[state=collapsed]/sidebar-wrapper:ml-[var(--sidebar-width-icon)]">
        <div className="flex gap-6">
          <div className="w-32 flex-shrink-0">
            <div className="mb-2 h-4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="min-h-[100px] animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Journal content component that handles data fetching
 */
async function JournalContent() {
  const { entries, error } = await getJournalEntries();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Failed to load journal entries
          </h2>
          <p className="mb-4 text-gray-600">
            An unexpected error occurred while loading your journal entries
          </p>
          <ErrorReloadButton />
        </div>
      </div>
    );
  }

  return <JournalForm initialEntries={entries} />;
}

/**
 * Main journal page component with error boundaries and loading states
 */
export default function JournalPage() {
  return (
    <div className="flex h-full flex-col">
      <Suspense fallback={<JournalLoading />}>
        <JournalContent />
      </Suspense>
    </div>
  );
}

// Export metadata for better SEO and page info
export const metadata = {
  title: "Journal",
  description: "Your personal journal for daily thoughts and reflections",
};
