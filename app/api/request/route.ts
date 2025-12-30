import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, momentId } = body;

    // Validate required fields
    if (!name || !email || !momentId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert booking request into Supabase
    const { data, error } = await supabase
      .from("requests")
      .insert({
        name,
        email,
        moment_id: momentId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save request" },
        { status: 500 }
      );
    }

    // Log the request to console
    console.log("Moment request received and saved:", {
      name,
      email,
      momentId,
      id: data?.id,
      timestamp: new Date().toISOString(),
    });

    // Send email notification using Resend
    const recipientEmail = process.env.NOTIFICATION_EMAIL;
    if (recipientEmail) {
      try {
        await resend.emails.send({
          from: "Moments <onboarding@resend.dev>", // Update with your verified domain
          to: recipientEmail,
          subject: "New Moment Booking Request",
          html: `
            <h2>New Moment Booking Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Moment ID:</strong> ${momentId}</p>
            <p><strong>Request ID:</strong> ${data?.id}</p>
            <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
          `,
        });
        console.log("Email notification sent successfully");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails
      }
    }

    // Return success response
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

