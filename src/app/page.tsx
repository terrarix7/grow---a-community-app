import { auth, signIn } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/journal");
  }

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

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/journal" });
          }}
          className="mt-4"
        >
          <button
            type="submit"
            className="relative z-10 flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-4 text-lg font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
