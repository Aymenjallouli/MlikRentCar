import { NextRequest, NextResponse } from "next/server";
import { updateReservationStatus, getReservations, getCarById } from "@/lib/db";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

async function sendMessage(text: string, extra?: object) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "Markdown", ...extra }),
  });
}

async function answerCallback(callbackQueryId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  // Handle text commands
  const message = body.message as Record<string, unknown> | undefined;
  if (message) {
    const text = (message.text as string) ?? "";
    if (text === "/start" || text === "/reservations" || text === "/list") {
      await handleListReservations();
    }
    return NextResponse.json({ ok: true });
  }

  // Handle inline button presses
  const cbq = body.callback_query as Record<string, unknown> | undefined;
  if (!cbq) return NextResponse.json({ ok: true });

  const cbqId = cbq.id as string;
  const data = cbq.data as string;

  if (data === "list") {
    await answerCallback(cbqId, "Chargement...");
    await handleListReservations();
    return NextResponse.json({ ok: true });
  }

  if (data.startsWith("confirm:") || data.startsWith("reject:")) {
    const [action, reservationId] = data.split(":");
    const status = action === "confirm" ? "confirmed" : "rejected";
    const updated = updateReservationStatus(reservationId, status as "confirmed" | "rejected");

    if (!updated) {
      await answerCallback(cbqId, "Réservation introuvable.");
      return NextResponse.json({ ok: true });
    }

    await answerCallback(cbqId, status === "confirmed" ? "✅ Confirmée !" : "❌ Rejetée.");

    const car = getCarById(updated.carId);
    const carName = car ? `${car.brand} ${car.model}` : "Véhicule non précisé";
    const emoji = status === "confirmed" ? "✅" : "❌";
    const label = status === "confirmed" ? "CONFIRMÉE" : "REJETÉE";

    await sendMessage(
      `${emoji} *Réservation ${label}*\n\n` +
      `👤 ${updated.userName} — ${updated.userPhone}\n` +
      `🚘 ${carName}\n` +
      `📅 ${updated.startDate} → ${updated.endDate}`
    );

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

async function handleListReservations() {
  const all = getReservations().reverse().slice(0, 10);
  if (all.length === 0) {
    await sendMessage("📋 *Aucune réservation pour l'instant.*");
    return;
  }

  const statusEmoji: Record<string, string> = {
    pending: "⏳",
    confirmed: "✅",
    rejected: "❌",
    cancelled: "🚫",
  };

  const lines = [`📋 *Dernières réservations (${all.length})*`, ``];
  for (const r of all) {
    const car = getCarById(r.carId);
    const carName = car ? `${car.brand} ${car.model}` : "Non précisé";
    const emoji = statusEmoji[r.status] ?? "❓";
    lines.push(
      `${emoji} *${r.userName}* — ${r.userPhone}`,
      `   🚘 ${carName} | 📅 ${r.startDate} → ${r.endDate}`,
      ``
    );
  }

  const inline_keyboard = all
    .filter((r) => r.status === "pending")
    .slice(0, 5)
    .map((r) => [
      { text: `✅ ${r.userName.split(" ")[0]}`, callback_data: `confirm:${r.id}` },
      { text: `❌ Rejeter`, callback_data: `reject:${r.id}` },
    ]);

  await sendMessage(lines.join("\n"), inline_keyboard.length ? { reply_markup: { inline_keyboard } } : undefined);
}

// GET: used to verify the webhook is reachable
export async function GET() {
  return NextResponse.json({ ok: true, service: "mlika-telegram-webhook" });
}
