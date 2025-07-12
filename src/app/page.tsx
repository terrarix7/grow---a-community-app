export default async function HomePage() {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-8">
        <div className="flex items-center space-x-4">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-16 w-12 text-indigo-500"
            />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-800">Grow</h1>
            <p className="text-lg text-gray-600">
              A little journal to nurture your thoughts
            </p>
          </div>
        </div>

        {/* Improved Arrow with prominent left and right curves */}
        <div className="relative flex justify-center py-16">
          <svg
            className="absolute -top-4 left-1/2 h-48 w-32 -translate-x-1/2 text-cyan-500"
            viewBox="0 0 80 140"
            fill="none"
          >
            <path
              d="M40 8 C30 20 25 35 20 45 C15 55 20 60 30 65 C40 70 50 75 60 85 C70 95 65 100 55 105 C45 110 35 115 40 125 M35 120 L40 125 L45 120"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <a
          href="/journal"
          className="relative z-10 flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-4 text-lg font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
        >
          Continue to your journal
        </a>
      </div>
    </div>
  );
}
