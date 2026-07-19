import { NextResponse } from "next/server";

// Real Gmail integration requires OAuth2 (Google Cloud project + consent screen +
// refresh token). Env vars below are what you'd need — until they're set, this
// honestly reports "not connected" instead of faking an inbox count.
//
// Required env vars for live mode:
//   GMAIL_CLIENT_ID
//   GMAIL_CLIENT_SECRET
//   GMAIL_REFRESH_TOKEN
//
// Setup: Google Cloud Console -> OAuth consent screen -> Credentials -> OAuth
// client (Desktop) -> use the OAuth Playground (https://developers.google.com/oauthplayground)
// with scope https://www.googleapis.com/auth/gmail.readonly to mint a refresh token.

async function getAccessToken() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN } = process.env;
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token as string;
}

export async function GET() {
  const token = await getAccessToken();

  if (!token) {
    return NextResponse.json({
      connected: false,
      message: "Gmail not connected. Set GMAIL_CLIENT_ID / GMAIL_CLIENT_SECRET / GMAIL_REFRESH_TOKEN to enable live inbox data.",
    });
  }

  try {
    const listRes = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=5",
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    const listData = await listRes.json();
    const ids: string[] = (listData.messages || []).map((m: any) => m.id);

    const messages = await Promise.all(
      ids.map(async (id) => {
        const r = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        );
        const m = await r.json();
        const headers = m.payload?.headers || [];
        const from = headers.find((h: any) => h.name === "From")?.value || "Unknown";
        const subject = headers.find((h: any) => h.name === "Subject")?.value || "(no subject)";
        return { id, from, subject, snippet: m.snippet };
      })
    );

    return NextResponse.json({
      connected: true,
      unreadCount: listData.resultSizeEstimate || messages.length,
      messages,
    });
  } catch {
    return NextResponse.json({ connected: false, message: "Gmail API request failed" });
  }
}
