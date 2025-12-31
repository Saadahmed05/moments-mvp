"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { moments } from "@/lib/data";

export default function MomentDetailPage() {
  const params = useParams();
  const momentId = params.id as string;
  const moment = moments.find((m) => m.id === momentId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!moment) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <p className="text-zinc-600 dark:text-zinc-400">Moment not found.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Back to Explore Moments
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Track intent using window.va.track
      if (typeof window !== "undefined" && (window as any).va) {
        (window as any).va.track("request_moment", { momentId: moment.id });
      }

      const response = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          momentId: moment.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setSuccess(true);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          {/* Moment Details */}
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-black dark:text-zinc-50">
              {moment.title}
            </h1>
            <p className="mb-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {moment.description}
            </p>

            <div className="mb-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="font-medium">City:</span>
                <span>{moment.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Duration:</span>
                <span>{moment.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Price:</span>
                <span className="text-lg font-semibold text-black dark:text-zinc-50">
                  ${moment.price}
                </span>
              </div>
            </div>

            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
              Limited availability · High demand
            </p>
          </div>

          {/* Request Form */}
          <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
              Request Access
            </h2>

            {success && (
              <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✅ Request received. We'll contact you shortly.
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={success}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-black shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={success}
                  className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-black shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                {loading
                  ? "Sending..."
                  : success
                  ? "Request Sent ✓"
                  : "Request Access to This Moment"}
              </button>
            </form>

            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              No payment required. We'll contact you personally.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
