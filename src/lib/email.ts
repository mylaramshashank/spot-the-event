export interface SuggestionEmailData {
  name: string;
  url?: string;
  date_text?: string;
  organizer?: string;
  college?: string;
  contact?: string;
  is_free?: boolean;
  price?: string;
}

export interface SendEmailResult {
  success: boolean;
  delivered: boolean;
  reason?: string;
  id?: string;
  error?: string;
}

export async function sendSuggestionNotification(
  data: SuggestionEmailData
): Promise<SendEmailResult> {
  const recipient = process.env.NOTIFICATION_EMAIL || "mylaramshashank@gmail.com";
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Spot The Event <onboarding@resend.dev>";

  const isFree = data.is_free !== false;
  const costLabel = isFree ? "Free" : `Paid (${data.price || "Price not specified"})`;
  const cleanName = (data.name || "").replace(/[\r\n]+/g, " ").trim().slice(0, 160);
  const cleanCost = costLabel.replace(/[\r\n]+/g, " ").trim().slice(0, 80);
  const subject = `[Spot The Event] New Suggestion: ${cleanName} (${cleanCost})`;

  const textBody = [
    `NEW EVENT SUGGESTION RECEIVED`,
    `=================================`,
    `Event Name:      ${data.name}`,
    `Cost:            ${costLabel}`,
    data.price ? `Price:           ${data.price}` : null,
    `Link / URL:      ${data.url || "N/A"}`,
    `Dates / Timeline:${data.date_text || "TBD"}`,
    `Organizer:       ${data.organizer || "Community suggestion"}`,
    `College/Campus:  ${data.college || "N/A"}`,
    `Contact Details: ${data.contact || "N/A"}`,
    `Submitted At:    ${new Date().toISOString()}`,
    `=================================`,
  ]
    .filter(Boolean)
    .join("\n");

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0b1530; margin: 0; padding: 24px; }
          .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); word-wrap: break-word; overflow-wrap: break-word; }
          .header { background-color: #0b1530; color: #ffffff; padding: 24px; word-break: break-word; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; word-break: break-word; }
          .header p { margin: 6px 0 0; font-size: 13px; color: #17795a; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
          .content { padding: 24px; }
          .row { display: flex; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
          .label { width: 140px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; shrink: 0; }
          .value { flex: 1; font-size: 14px; font-weight: 500; color: #0b1530; word-break: break-word; overflow-wrap: break-word; }
          .badge-free { display: inline-block; padding: 3px 10px; background-color: #ecfdf5; color: #047857; border-radius: 9999px; font-size: 12px; font-weight: 700; }
          .badge-paid { display: inline-block; padding: 3px 10px; background-color: #fef2f2; color: #b91c1c; border-radius: 9999px; font-size: 12px; font-weight: 700; word-break: break-word; }
          .footer { padding: 16px 24px; background-color: #f8fafc; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <p>Spot The Event · Suggestion Queue</p>
            <h1>${escapeHtml(data.name)}</h1>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">Status</div>
              <div class="value">
                ${
                  isFree
                    ? '<span class="badge-free">FREE EVENT</span>'
                    : `<span class="badge-paid">PAID EVENT · ${escapeHtml(data.price || "Fee required")}</span>`
                }
              </div>
            </div>
            ${
              !isFree && data.price
                ? `<div class="row"><div class="label">Price</div><div class="value"><strong>${escapeHtml(data.price)}</strong></div></div>`
                : ""
            }
            <div class="row">
              <div class="label">Official URL</div>
              <div class="value"><a href="${escapeHtml(data.url || "#")}" style="color: #17795a; text-decoration: underline;">${escapeHtml(data.url || "N/A")}</a></div>
            </div>
            <div class="row">
              <div class="label">Date / Timeline</div>
              <div class="value">${escapeHtml(data.date_text || "TBD")}</div>
            </div>
            <div class="row">
              <div class="label">Organizer</div>
              <div class="value">${escapeHtml(data.organizer || "Community suggestion")}</div>
            </div>
            ${
              data.college
                ? `<div class="row"><div class="label">College</div><div class="value">${escapeHtml(data.college)}</div></div>`
                : ""
            }
            ${
              data.contact
                ? `<div class="row"><div class="label">Contact</div><div class="value">${escapeHtml(data.contact)}</div></div>`
                : ""
            }
          </div>
          <div class="footer">
            Submitted via Spot The Event suggestion form · Recipient: ${recipient}
          </div>
        </div>
      </body>
    </html>
  `.trim();

  // If no Resend API key configured, use graceful console fallback logging
  if (!apiKey) {
    console.log(
      `[Email Service Fallback] No RESEND_API_KEY configured. Logging email notification for ${recipient}:`
    );
    console.log(textBody);
    return {
      success: true,
      delivered: false,
      reason: "RESEND_API_KEY not configured. Event details logged to console fallback.",
    };
  }

  // Send via Resend API
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipient],
        subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Email Service] Resend API error (${res.status}): ${errText}`);
      console.log(`[Email Service Fallback Log] Notification for ${recipient}:\n${textBody}`);
      return {
        success: true,
        delivered: false,
        error: errText,
        reason: "Resend API error; logged to console fallback.",
      };
    }

    const json = (await res.json()) as { id?: string };
    console.log(`[Email Service] Notification sent successfully to ${recipient} (id: ${json.id})`);
    return {
      success: true,
      delivered: true,
      id: json.id,
    };
  } catch (err) {
    console.error("[Email Service] Exception sending email via Resend:", err);
    console.log(`[Email Service Fallback Log] Notification for ${recipient}:\n${textBody}`);
    return {
      success: true,
      delivered: false,
      error: String(err),
      reason: "Network error; logged to console fallback.",
    };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
