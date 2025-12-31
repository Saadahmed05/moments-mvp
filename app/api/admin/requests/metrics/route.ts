import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Read admin password from request header
    const providedPassword = request.headers.get("x-admin-password");
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate password
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!providedPassword || providedPassword !== adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch moment_id and created_at from requests table
    const { data, error } = await supabase
      .from("requests")
      .select("moment_id, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch requests data" },
        { status: 500 }
      );
    }

    // Compute metrics
    const totalRequests = data?.length || 0;

    // Calculate requests per moment
    const requestsPerMoment: Record<string, number> = {};
    let lastActivity: string | null = null;

    if (data && data.length > 0) {
      data.forEach((row) => {
        const momentId = row.moment_id || "unknown";
        requestsPerMoment[momentId] = (requestsPerMoment[momentId] || 0) + 1;

        // Track most recent activity
        if (row.created_at) {
          if (!lastActivity || row.created_at > lastActivity) {
            lastActivity = row.created_at;
          }
        }
      });
    }

    // Find most requested moment
    const mostRequestedMoment =
      Object.entries(requestsPerMoment).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      null;

    // Return metrics as JSON
    return NextResponse.json({
      totalRequests,
      requestsPerMoment,
      mostRequestedMoment,
      lastActivity,
    });
  } catch (error) {
    console.error("Server error in metrics route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
