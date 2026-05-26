import { NextRequest, NextResponse } from "next/server";
import { getAdminPasswordOverride, setAdminPasswordOverride } from "@/lib/db";

async function getEffectivePassword(): Promise<string> {
  return (await getAdminPasswordOverride()) ?? process.env.ADMIN_PASSWORD ?? "mlika2024";
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const adminUser = process.env.ADMIN_USERNAME ?? "admin";

  if (username === adminUser && password === await getEffectivePassword()) {
    return NextResponse.json({ ok: true, token: process.env.ADMIN_SECRET ?? "mlika-admin-secret" });
  }
  return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
}

export async function PUT(req: NextRequest) {
  if (req.headers.get("x-admin-token") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { currentPassword, newPassword } = await req.json();

  if (currentPassword !== await getEffectivePassword()) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
  }
  if (!newPassword || newPassword.length < 4) {
    return NextResponse.json({ error: "Nouveau mot de passe trop court." }, { status: 400 });
  }

  await setAdminPasswordOverride(newPassword);
  return NextResponse.json({ ok: true });
}
