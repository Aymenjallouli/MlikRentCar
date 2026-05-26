import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/login — validate admin credentials and return token
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  const adminUser = process.env.ADMIN_USERNAME ?? "admin";
  const adminPass = process.env.ADMIN_PASSWORD ?? "mlika2024";

  if (username === adminUser && password === adminPass) {
    return NextResponse.json({ ok: true, token: process.env.ADMIN_SECRET ?? "mlika-admin-secret" });
  }
  return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
}
