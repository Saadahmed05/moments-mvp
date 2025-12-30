import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, city, assetType, description } = body;

    // Log the submitted data to console
    console.log("Host onboarding submission received:", {
      name,
      email,
      city,
      assetType,
      description,
      timestamp: new Date().toISOString(),
    });

    // Return success response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing host onboarding:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

