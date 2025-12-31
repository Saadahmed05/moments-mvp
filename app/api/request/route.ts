import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, momentId } = body;

    // Basic validation
    if (!name || !email || !momentId) {
      console.error("❌ Missing fields:", body);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("📥 New booking request:", body);

    const { data, error } = await supabase
      .from("requests") // ✅ MUST MATCH TABLE NAME EXACTLY
      .insert([
        {
          name,
          email,
          moment_id: momentId,
        },
      ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    console.log("✅ Inserted successfully:", data);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("🔥 API crashed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
