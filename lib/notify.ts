import type { Reservation, Car } from "./db";

export async function notifyTelegram(reservation: Reservation, car: Car) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const days = Math.max(1, Math.round(
    (new Date(reservation.endDate).getTime() - new Date(reservation.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  ));
  const officialTotal = days * car.pricePerDay;

  const lines = [
    `🚗 *Nouvelle Réservation — MLIK'A*`,
    ``,
    `👤 *Client:* ${reservation.userName}`,
    `📞 *Téléphone:* ${reservation.userPhone}`,
  ];

  if (reservation.userAge) lines.push(`🎂 *Âge:* ${reservation.userAge} ans`);
  if (reservation.userPermisDate) lines.push(`🪪 *Permis depuis:* ${reservation.userPermisDate}`);

  lines.push(
    ``,
    `🚘 *Voiture:* ${car.brand} ${car.model}${car.year ? ` (${car.year})` : ""}`,
    `📅 *Du:* ${reservation.startDate}`,
    `📅 *Au:* ${reservation.endDate} (${days} jour${days > 1 ? "s" : ""})`,
    `📍 *Prise en charge:* ${reservation.pickupLocation}`,
    `📍 *Retour:* ${reservation.returnLocation}`,
    ``,
    `💰 *Tarif officiel:* ${officialTotal} DT${car.pricePerDay ? ` (${car.pricePerDay} DT/j)` : ""}`,
  );

  if (reservation.proposedPrice && reservation.proposedPrice !== officialTotal) {
    lines.push(`🤝 *Contre-offre client:* ${reservation.proposedPrice} DT`);
    if (reservation.negotiationNote) {
      lines.push(`💬 *Message:* _${reservation.negotiationNote}_`);
    }
    const discount = Math.round((1 - reservation.proposedPrice / officialTotal) * 100);
    lines.push(`📉 Remise demandée: −${discount}%`);
  }

  lines.push(
    ``,
    `⏳ *Statut:* En attente de confirmation`,
  );

  const inline_keyboard = [
    [
      { text: "✅ Confirmer", callback_data: `confirm:${reservation.id}` },
      { text: "❌ Rejeter", callback_data: `reject:${reservation.id}` },
    ],
    [
      { text: "📋 Toutes les réservations", callback_data: `list` },
    ],
  ];

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard },
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[notify] Telegram error:", err);
    }
  } catch (e) {
    console.error("[notify] Telegram notification failed:", e);
  }
}

export function buildWhatsAppNotifyUrl(reservation: Reservation, car: Car): string {
  const days = Math.max(1, Math.round(
    (new Date(reservation.endDate).getTime() - new Date(reservation.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  ));
  const msg = encodeURIComponent(
    `Nouvelle réservation MLIK'A:\n` +
    `Client: ${reservation.userName}\n` +
    `Tél: ${reservation.userPhone}\n` +
    (reservation.userAge ? `Âge: ${reservation.userAge} ans\n` : "") +
    (reservation.userPermisDate ? `Permis: ${reservation.userPermisDate}\n` : "") +
    `Voiture: ${car.brand} ${car.model}\n` +
    `Du ${reservation.startDate} au ${reservation.endDate} (${days}j)\n` +
    `Lieu: ${reservation.pickupLocation}\n` +
    (reservation.proposedPrice ? `Contre-offre: ${reservation.proposedPrice} DT` : ``)
  );
  return `https://wa.me/21652526595?text=${msg}`;
}
