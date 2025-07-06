import React from "react";
import { getJournalEntries } from "./action";
import { JournalForm } from "./date";

export default async function JournalPage() {
  const entries = await getJournalEntries();

  return (
    <div className="h-full">
      <JournalForm initialEntries={entries} />
    </div>
  );
}
