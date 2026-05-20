import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  // 1. Parse and validate JSON body
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON request body." } },
      { status: 400 }
    );
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: { message: "Name, email, and message are required." } },
      { status: 400 }
    );
  }

  // 2. Retrieve the API Key from environment
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not defined in the environment variables.");
    return NextResponse.json(
      { error: { message: "Mail service is not configured." } },
      { status: 500 }
    );
  }

  // 3. Initialize Resend client
  const resend = new Resend(apiKey);

  // 4. Determine from/to addresses
  // In production, the 'from' email must use the verified domain
  const fromAddress = process.env.RESEND_FROM_EMAIL || "Acme <onboarding@resend.dev>";
  const toAddress = process.env.RESEND_TO_EMAIL || "delivered@resend.dev";

  // 5. Send email and capture response
  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: [toAddress],
    subject: `Portfolio Contact: ${name}`,
    replyTo: email,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #171717; font-weight: 500; border-bottom: 1px solid #eaeaea; padding-bottom: 12px; margin-top: 0;">
          New Portfolio Message
        </h2>
        <p style="margin: 16px 0; color: #404040;">
          <strong>Name:</strong> ${name}
        </p>
        <p style="margin: 16px 0; color: #404040;">
          <strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
        </p>
        <p style="margin: 16px 0; color: #404040; font-weight: 500;">
          Message:
        </p>
        <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px; border: 1px solid #e5e5e5; white-space: pre-wrap; color: #262626; line-height: 1.6;">
          ${message}
        </div>
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 24px 0;" />
        <p style="font-size: 12px; color: #737373; margin-bottom: 0;">
          Sent automatically via Resend Node.js SDK on your portfolio website.
        </p>
      </div>
    `,
  });

  // 6. Handle both data and error cases
  if (error) {
    console.error("Resend API error:", error);
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ data });
}
