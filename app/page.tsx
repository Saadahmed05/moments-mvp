import Link from "next/link";
import { moments } from "@/lib/data";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-black dark:text-zinc-50">
          Explore Moments
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold text-black dark:text-zinc-50">
                  {moment.title}
                </h2>
                <div className="mb-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Duration:</span>
                    <span>{moment.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">City:</span>
                    <span>{moment.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Price:</span>
                    <span className="text-lg font-semibold text-black dark:text-zinc-50">
                      ${moment.price}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/moments/${moment.id}`}
                  className="block w-full rounded-md bg-black px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  View Moment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
