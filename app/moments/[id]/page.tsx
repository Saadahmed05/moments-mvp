import Link from "next/link";
import { moments } from "@/lib/data";
import { notFound } from "next/navigation";
import MomentRequestForm from "./MomentRequestForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MomentPage({ params }: PageProps) {
  const { id } = await params;
  const moment = moments.find((m) => m.id === id);

  if (!moment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to Explore Moments
        </Link>
        <div className="mx-auto max-w-2xl rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-zinc-50">
            {moment.title}
          </h1>
          <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
            {moment.description}
          </p>
          <div className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <div className="flex justify-between">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Duration:
              </span>
              <span className="text-black dark:text-zinc-50">
                {moment.duration}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                City:
              </span>
              <span className="text-black dark:text-zinc-50">
                {moment.city}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Category:
              </span>
              <span className="text-black dark:text-zinc-50">
                {moment.category}
              </span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
              <span className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
                Price:
              </span>
              <span className="text-2xl font-bold text-black dark:text-zinc-50">
                ${moment.price}
              </span>
            </div>
          </div>
          <MomentRequestForm momentId={moment.id} />
        </div>
      </main>
    </div>
  );
}

