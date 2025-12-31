"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface MetricsData {
  totalRequests: number;
  requestsPerMoment: Record<string, number>;
  mostRequestedMoment: string | null;
  lastActivity: string | null;
}

export default function MetricsPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState<MetricsData | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/requests/metrics", {
        method: "GET",
        headers: {
          "x-admin-password": password,
        },
      });

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setError(
          `Server returned unexpected response (${response.status} ${response.statusText})`
        );
        setLoading(false);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        setError("Server returned invalid JSON response");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          setError(
            data.error === "Unauthorized"
              ? "Unauthorized: Invalid password. Please check your credentials."
              : data.error || "Unauthorized: Invalid password"
          );
        } else if (response.status === 500) {
          setError(
            data.error ||
              "Server error: Unable to fetch metrics. Please try again later."
          );
        } else {
          setError(
            data.error ||
              `Request failed with status ${response.status}. Please try again.`
          );
        }
        setLoading(false);
        return;
      }

      // Validate response structure
      if (!data || typeof data !== "object") {
        setError("Invalid response format from server");
        setLoading(false);
        return;
      }

      // Ensure required fields exist
      if (
        typeof data.totalRequests !== "number" ||
        typeof data.requestsPerMoment !== "object" ||
        (data.lastActivity !== null && typeof data.lastActivity !== "string")
      ) {
        setError("Response missing required metrics data");
        setLoading(false);
        return;
      }

      setMetrics(data);
      setAuthorized(true);
      setError("");
    } catch (err) {
      // Handle network errors and other exceptions
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Network error: Unable to connect to server. Please check your connection and try again."
        );
      } else if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Metrics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthorized(false);
    setPassword("");
    setMetrics(null);
    setError("");
  };

  // Password prompt screen
  if (!authorized) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-2 text-center text-black dark:text-zinc-50">
              Admin Metrics
            </h1>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-6">
              Enter password to view metrics
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-black dark:text-zinc-50 placeholder-zinc-500 focus:border-black dark:focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full rounded-md bg-black dark:bg-zinc-50 px-4 py-3 text-sm font-medium text-white dark:text-black transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "View Metrics"}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-center text-red-800 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <Link
              href="/admin"
              className="mt-4 block text-center text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Metrics dashboard
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            Metrics Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-zinc-50"></div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Loading metrics...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-1">
                  Error Loading Metrics
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError("");
                    setAuthorized(false);
                    setPassword("");
                  }}
                  className="mt-3 text-sm font-medium text-red-800 dark:text-red-400 hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : metrics ? (
          <>
            {/* Metrics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Total Requests"
                value={metrics.totalRequests.toString()}
              />
              <MetricCard
                title="Most Requested Moment"
                value={metrics.mostRequestedMoment || "—"}
              />
              <MetricCard
                title="Last Activity"
                value={
                  metrics.lastActivity
                    ? new Date(metrics.lastActivity).toLocaleString()
                    : "—"
                }
              />
            </div>

            {/* Requests per Moment Table */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Requests per Moment
                </h2>
              </div>
              {Object.keys(metrics.requestsPerMoment).length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    No requests data available.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Moment ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          Request Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {Object.entries(metrics.requestsPerMoment)
                        .sort((a, b) => b[1] - a[1])
                        .map(([momentId, count]) => (
                          <tr
                            key={momentId}
                            className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-zinc-50">
                              {momentId}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                              {count}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No metrics data available. Please try refreshing.
            </p>
            <button
              onClick={() => {
                setAuthorized(false);
                setPassword("");
                setMetrics(null);
              }}
              className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              Return to login
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
        {title}
      </p>
      <p className="text-2xl font-bold text-black dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}
