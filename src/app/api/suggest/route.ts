import { NextRequest, NextResponse } from "next/server";
import { sendSuggestionNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot bot protection
    if (body.website_hp) {
      return NextResponse.json({ success: true, message: "Submission accepted" });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json(
        { error: "Event name is required" },
        { status: 400 }
      );
    }

    const is_free = body.is_free !== false && body.is_free !== "false";
    const rawPrice = typeof body.price === "string" ? body.price.trim().slice(0, 120) : "";
    const price = rawPrice.length > 0 ? rawPrice : undefined;

    if (!is_free && !price) {
      return NextResponse.json(
        { error: "Price or registration fee is required for paid events" },
        { status: 400 }
      );
    }

    const url = typeof body.url === "string" ? body.url.trim().slice(0, 500) : "";
    const date_text = typeof body.date_text === "string" ? body.date_text.trim().slice(0, 120) : "";
    const organizer = typeof body.organizer === "string" ? body.organizer.trim().slice(0, 150) : "";
    const college = typeof body.college === "string" && body.college.trim() ? body.college.trim().slice(0, 150) : undefined;
    const contact = typeof body.contact === "string" && body.contact.trim() ? body.contact.trim().slice(0, 150) : undefined;

    const emailResult = await sendSuggestionNotification({
      name: name.slice(0, 200),
      url,
      date_text,
      organizer,
      college,
      contact,
      is_free,
      price: !is_free ? price : undefined,
    });

    return NextResponse.json({
      success: true,
      delivered: emailResult.delivered,
      reason: emailResult.reason,
    });
  } catch (err) {
    console.error("[API /api/suggest] Error handling suggestion:", err);
    return NextResponse.json(
      { error: "Failed to process suggestion" },
      { status: 500 }
    );
  }
}
