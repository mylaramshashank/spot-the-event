// Email Notification Service via Resend API (free tier: 3,000 emails/month)
// Configure RESEND_API_KEY and NOTIFICATION_EMAIL in .env.local or deployment environment.

interface SuggestionEmailPayload {
  name: string;
  is_free: boolean;
  price?: string;
  url: string;
  date_text: string;
  organizer: string;
  college?: string;
  contact?: string;
}

function stripHeaderControls(str: string): string {
  return str.replace(/[\r\n\0\x00-\x1F\x7F]+/g, " ").trim();
}

function getSafeHttpHref(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export async function sendSuggestionNotification(data: SuggestionEmailPayload): Promise<{
  delivered: boolean;
  reason?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.NOTIFICATION_EMAIL?.trim() || "mylaramshashank@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "Spot the Event <onboarding@resend.dev>";

  const cleanName = stripHeaderControls(data.name).slice(0, 120);
  const priceLabel = data.is_free ? "FREE" : `PAID (${data.price || "Price specified"})`;
  const subject = `[Spot the Event] New Event Suggestion: ${cleanName} (${stripHeaderControls(priceLabel).slice(0, 60)})`;

  const safeHref = getSafeHttpHref(data.url);
  const urlBlockHtml = safeHref
    ? `<a href="${escapeHtml(safeHref)}" style="color: #17795a; text-decoration: underline;">${escapeHtml(safeHref)}</a>`
    : `<span>${escapeHtml(data.url || "N/A")}</span>`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0b1530; background: #f8fafc; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
          .header { background: #0b1530; color: #ffffff; padding: 24px; }
          .badge { display: inline-block; background: #17795a; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 99px; margin-bottom: 10px; }
          .title { font-size: 20px; font-weight: 700; margin: 0; color: #ffffff; }
          .body { padding: 24px; }
          .row { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
          .row:last-child { border-bottom: none; }
          .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 4px; }
          .value { font-size: 14px; font-weight: 600; color: #0b1530; }
          .free-pill { display: inline-block; background: #d1fae5; color: #059669; padding: 2px 10px; border-radius: 99px; font-size: 12px; font-weight: 700; }
          .paid-pill { display: inline-block; background: #fee2e2; color: #dc2626; padding: 2px 10px; border-radius: 99px; font-size: 12px; font-weight: 700; }
          .footer { background: #f8fafc; padding: 16px 24px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="badge">New Suggestion Received</div>
            <h1 class="title">${escapeHtml(cleanName)}</h1>
          </div>
          <div class="body">
            <div class="row">
              <div class="label">Pricing Status</div>
              <div class="value">
                ${
                  data.is_free
                    ? '<span class="free-pill">FREE EVENT</span>'
                    : `<span class="paid-pill">PAID · ${escapeHtml(data.price || "Check Link")}</span>`
                }
              </div>
            </div>
            <div class="row">
              <div class="label">Official URL</div>
              <div class="value">${urlBlockHtml}</div>
            </div>
            <div class="row">
              <div class="label">Dates / Schedule</div>
              <div class="value">${escapeHtml(data.date_text || "Not specified")}</div>
            </div>
            <div class="row">
              <div class="label">Organizer</div>
              <div class="value">${escapeHtml(data.organizer)}</div>
            </div>
            ${
              data.college
                ? `
            <div class="row">
              <div class="label">College / Community</div>
              <div class="value">${escapeHtml(data.college)}</div>
            </div>`
                : ""
            }
            ${
              data.contact
                ? `
            <div class="row">
              <div class="label">Submitter Contact</div>
              <div class="value">${escapeHtml(data.contact)}</div>
            </div>`
                : ""
            }
          </div>
          <div class="footer">
            Submitted via <strong>Spot the Event</strong> by Venlix. Review and approve in your Admin Console.
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `
New Event Suggestion for Spot the Event:

Event Name: ${cleanName}
Pricing: ${priceLabel}
URL: ${safeHref || "Invalid URL"}
Date: ${data.date_text || "Not specified"}
Organizer: ${data.organizer}
College: ${data.college || "N/A"}
Contact: ${data.contact || "N/A"}

Review it in your Admin Console!
  `.trim();

  if (!apiKey || apiKey === "re_your_api_key_here") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[Suggestion Notification Fallback]", {
        subject,
        event: cleanName,
      });
    }
    return {
      delivered: false,
      reason: "email_not_configured",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) {
      console.error("[Email] Resend API rejected request with status:", res.status);
      return { delivered: false, reason: "delivery_failed" };
    }

    return { delivered: true };
  } catch {
    console.error("[Email] Network failure dispatching suggestion notification.");
    return { delivered: false, reason: "network_error" };
  }
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
