"use client";

import { useState, FormEvent } from "react";

interface Request {
  id: string;
  name: string;
  email: string;
  moment_id: string;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminPassword) {
      setError("Admin password not configured");
      setLoading(false);
      return;
    }

    if (password !== adminPassword) {
      setError("Invalid password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/requests");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch requests");
      }

      setRequests(data.requests || []);
      setAuthorized(true);
      setFetchError("");
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthorized(false);
    setPassword("");
    setRequests([]);
    setError("");
    setFetchError("");
  };

  // Password screen
  if (!authorized) {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
            <h1 className="text-2xl font-bold mb-2 text-center text-black dark:text-zinc-50">
              Admin Dashboard
            </h1>
            <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-6">
              Enter password to continue
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
                disabled={loading}
                className="w-full rounded-md bg-black dark:bg-zinc-50 px-4 py-3 text-sm font-medium text-white dark:text-black transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Checking..." : "Enter"}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            Booking Requests
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>

        {fetchError && (
          <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm text-red-800 dark:text-red-400">
              Error: {fetchError}
            </p>
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">No requests yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Moment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-zinc-50">
                        {req.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {req.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {req.moment_id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500 dark:text-zinc-500">
                        {new Date(req.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
