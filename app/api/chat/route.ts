import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCars } from "@/lib/db";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = (carsInfo: string) => `Tu es le concierge IA de MLIK'A, une agence de location de voiture premium en Tunisie gérée par Ahmed Mlik. Tu réponds toujours en français, de façon chaleureuse, professionnelle et concise.

FLOTTE ACTUELLE:
${carsInfo}

TARIFS:
- Journée: à partir de 89 DT
- Semaine: à partir de 540 DT (−15%)
- Mois: à partir de 1990 DT (−30%)

SERVICES INCLUS:
- Livraison gratuite (aéroport, hôtel, domicile)
- Assurance tous risques
- Kilométrage illimité
- Sans dépôt caché
- Disponible 24h/24, 7j/7

CONTACT:
- WhatsApp: +216 52 526 595
- Téléphone: +216 52 445 525
- Adresse: Av. Habib Bourguiba, 1001, Tunis-Carthage
- Facebook: Ahmed Mlik

INSTRUCTIONS:
- Réponds en 2-4 phrases maximum, sauf si une liste est vraiment nécessaire
- Pour toute demande de réservation, invite l'utilisateur à remplir le formulaire sur la page ou à contacter via WhatsApp au 52 526 595
- Mets en **gras** les infos clés (prix, numéros, noms de modèles)
- Ne promets pas des choses non confirmées
- Si la question est hors-sujet (location de voiture), recentre poliment`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
  }

  const cars = getCars();
  const carsInfo = cars
    .map(
      (c) =>
        `- ${c.brand} ${c.model} (${c.year}): ${c.pricePerDay} DT/jour, ${c.boite}, ${c.conso}, ${c.places} places. ${c.available ? "Disponible" : "Indisponible"}.`
    )
    .join("\n");

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT(carsInfo),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json(
      { reply: "Désolé, une erreur est survenue. Contactez-nous directement au **52 526 595** sur WhatsApp." },
      { status: 200 }
    );
  }
}
