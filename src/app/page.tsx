import { auth, signIn } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/journal");
  }
  return (
    <div className="relative flex h-screen w-screen items-center justify-center">
      {/* Arrow 1 - Top left */}
      <svg
        className="absolute top-1/3 left-1/3 h-32 w-24 rotate-45 text-blue-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 2 - Top right */}
      <svg
        className="absolute top-1/3 right-1/3 h-32 w-24 rotate-135 text-red-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 3 - Left side */}
      <svg
        className="absolute top-1/2 left-1/4 h-32 w-24 rotate-90 text-green-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 4 - Right side */}
      <svg
        className="absolute top-1/2 right-1/4 h-32 w-24 -rotate-90 text-purple-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 5 - Bottom left */}
      <svg
        className="absolute bottom-1/3 left-1/3 h-32 w-24 -rotate-45 text-yellow-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 6 - Bottom right */}
      <svg
        className="absolute right-1/3 bottom-1/3 h-32 w-24 -rotate-135 text-pink-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 7 - Top center */}
      <svg
        className="absolute top-1/4 left-1/2 h-32 w-24 -translate-x-1/2 transform text-indigo-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 8 - Bottom center */}
      <svg
        className="absolute bottom-1/4 left-1/2 h-32 w-24 -translate-x-1/2 rotate-180 transform text-orange-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 9 - Left top diagonal */}
      <svg
        className="absolute top-2/5 left-2/5 h-32 w-24 rotate-45 text-teal-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      {/* Arrow 10 - Right bottom diagonal */}
      <svg
        className="absolute right-2/5 bottom-2/5 h-32 w-24 -rotate-135 text-cyan-500"
        viewBox="0 0 60 80"
        fill="none"
      >
        <path
          d="M10 10 Q20 30 15 50 Q10 70 40 75 M35 70 L40 75 L35 80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/journal" });
        }}
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
  );
}
