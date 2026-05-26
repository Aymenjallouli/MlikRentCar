import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OVERRIDE_FILE = path.join(process.cwd(), "data", "admin_override.json");

function getStoredPassword(): string | null {
  try {
    if (fs.existsSync(OVERRIDE_FILE)) {
      const data = JSON.parse(fs.readFileSync(OVERRIDE_FILE, "utf-8"));
      return data.password ?? null;
    }
  } catch {}
  return null;
}

function getEffectivePassword(): string {
  return getStoredPassword() ?? process.env.ADMIN_PASSWORD ?? "mlika2024";
}

// POST — validate credentials and return token
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  const adminUser = process.env.ADMIN_USERNAME ?? "admin";

  if (username === adminUser && password === getEffectivePassword()) {
    return NextResponse.json({ ok: true, token: process.env.ADMIN_SECRET ?? "mlika-admin-secret" });
  }
  return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
}

// PUT — change password (requires valid token + current password)
export async function PUT(req: NextRequest) {
  if (req.headers.get("x-admin-token") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (currentPassword !== getEffectivePassword()) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
  }
  if (!newPassword || newPassword.length < 4) {
    return NextResponse.json({ error: "Nouveau mot de passe trop court." }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OVERRIDE_FILE, JSON.stringify({ password: newPassword }, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
