import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendApplicationStatusUpdate } from "@/lib/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  if (!id || !action || !["accept", "reject"].includes(action)) {
    return new NextResponse(renderHtmlError("Invalid Parameters", "The link appears to be malformed or incomplete."), {
      headers: { "Content-Type": "text/html" },
      status: 400
    });
  }

  try {
    // 1. Fetch application details
    const { data: salon, error: fetchError } = await supabaseAdmin
      .from("salon_applications")
      .select("salon_name, owner_name, email, status")
      .eq("id", id)
      .single();

    if (fetchError || !salon) {
      console.error("Fetch salon error:", fetchError);
      return new NextResponse(renderHtmlError("Application Not Found", "The salon application could not be located in our partner database."), {
        headers: { "Content-Type": "text/html" },
        status: 404
      });
    }

    const isAccepted = action === "accept";
    const newStatus = isAccepted ? "accepted" : "rejected";

    // Prevent re-processing
    if (salon.status !== "pending") {
      return new NextResponse(renderHtmlSuccess(
        salon.salon_name, 
        salon.status.toUpperCase(), 
        `This application has already been processed as **${salon.status.toUpperCase()}**. No further actions were taken.`,
        salon.status === "accepted"
      ), {
        headers: { "Content-Type": "text/html" }
      });
    }

    // 2. Update status in database
    const { error: updateError } = await supabaseAdmin
      .from("salon_applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateError) {
      console.error("Update salon error:", updateError);
      return new NextResponse(renderHtmlError("Database Error", "Failed to update the salon status in the database. Please try again."), {
        headers: { "Content-Type": "text/html" },
        status: 500
      });
    }

    // 3. Dispatch automated follow-up email to salon owner
    try {
      await sendApplicationStatusUpdate({
        name: salon.owner_name,
        email: salon.email,
        type: "salon",
        status: newStatus
      });
    } catch (emailError) {
      console.error("Follow-up email error:", emailError);
    }

    return new NextResponse(renderHtmlSuccess(
      salon.salon_name, 
      newStatus.toUpperCase(), 
      isAccepted 
        ? "We logged the approval in the database and sent a partnership acceptance email to the salon owner. They will expect partner calls shortly."
        : "The application has been declined. A polite status update email has been sent to the salon owner.",
      isAccepted
    ), {
      headers: { "Content-Type": "text/html" }
    });

  } catch (err) {
    console.error("Action handler exception:", err);
    return new NextResponse(renderHtmlError("Internal Server Error", "An unexpected server error occurred. Please try again."), {
      headers: { "Content-Type": "text/html" },
      status: 500
    });
  }
}

// ─── Luxury HTML Render Templates ─────────────────────────────────────────────

function renderHtmlSuccess(name: string, status: string, desc: string, isAccepted: boolean) {
  const statusColor = isAccepted ? "#C9A84C" : "#6B5E52";
  const iconMarkup = isAccepted
    ? `<svg style="width: 48px; height: 48px; color: white;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>`
    : `<svg style="width: 48px; height: 48px; color: white;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Roopé Partner Decision logged</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          margin: 0; padding: 0;
          font-family: 'Inter', system-ui, sans-serif;
          background: linear-gradient(160deg, #F8F6F2 0%, #FAF6EC 100%);
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          color: #1A1612;
        }
        .container {
          max-width: 440px; w: 100%; margin: 20px;
          text-align: center;
        }
        .card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 20px 48px rgba(26, 22, 18, 0.08);
          border-radius: 32px;
          padding: 40px 32px;
        }
        .icon-box {
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px rgba(201, 168, 76, 0.2);
        }
        h1 {
          font-family: 'Instrument Sans', Georgia, serif;
          font-weight: 300;
          font-size: 26px;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .status-badge {
          display: inline-block;
          font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 6px 16px; border-radius: 20px;
          margin-bottom: 20px;
          background: rgba(201,168,76,0.12);
        }
        p {
          color: #6B5E52;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 32px;
        }
        .btn {
          display: inline-block;
          background: #1A1612;
          color: white;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(26,22,18,0.15);
        }
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,22,18,0.25);
        }
        .footer-text {
          color: #8B7D6B; font-size: 11px; margin-top: 24px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="icon-box" style="background: linear-gradient(135deg, ${statusColor}, #B8922E);">${iconMarkup}</div>
          <h1>${name}</h1>
          <div class="status-badge" style="color: ${statusColor}; background: ${isAccepted ? 'rgba(201,168,76,0.1)' : 'rgba(107,94,82,0.08)'};">${status}</div>
          <p>${desc}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" class="btn">Admin Panel</a>
        </div>
        <div class="footer-text">Roopé Partner Network</div>
      </div>
    </body>
    </html>
  `;
}

function renderHtmlError(title: string, desc: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} — Roopé</title>
      <style>
        body {
          margin: 0; padding: 0;
          font-family: system-ui, sans-serif;
          background: #FAF6EC;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          color: #1A1612;
        }
        .card {
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-radius: 24px;
          padding: 40px;
          max-width: 400px; text-align: center;
          border: 1px solid rgba(0,0,0,0.06);
        }
        .icon { font-size: 48px; margin-bottom: 16px; }
        h1 { font-size: 22px; margin: 0 0 10px; font-weight: 600; }
        p { color: #6B5E52; font-size: 14px; line-height: 1.6; margin: 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">⚠️</div>
        <h1>${title}</h1>
        <p>${desc}</p>
      </div>
    </body>
    </html>
  `;
}
