"use client";

export function ErrorReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="rounded bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-900"
    >
      Try Again
    </button>
  );
}
