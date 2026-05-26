import { NextRequest, NextResponse } from "next/server";

// GET /api/telegram-setup?action=webhook&url=https://yourdomain.com
// GET /api/telegram-setup?action=getupdates
// GET /api/telegram-setup?action=getme
// Protected by admin token header: x-admin-token

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-token") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "getme";

  if (action === "getupdates") {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "getme") {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "webhook") {
    const webhookUrl = searchParams.get("url");
    if (!webhookUrl) return NextResponse.json({ error: "url param required" }, { status: 400 });

    const fullUrl = `${webhookUrl}/api/telegram-webhook`;
    const body: Record<string, unknown> = { url: fullUrl };
    if (process.env.TELEGRAM_WEBHOOK_SECRET) {
      body.secret_token = process.env.TELEGRAM_WEBHOOK_SECRET;
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json({ webhook_url: fullUrl, telegram_response: data });
  }

  if (action === "webhookinfo") {
    const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
