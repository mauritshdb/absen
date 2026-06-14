import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, findUserByEmail, sanitizeUser } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = readDB();
  const user = db.users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ user: sanitizeUser(user) }, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, role } = body as {
      name?: string;
      email?: string;
      role?: string;
    };

    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
    }

    if (email) {
      const existing = findUserByEmail(email);
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { message: "Email sudah digunakan oleh pengguna lain." },
          { status: 409 }
        );
      }
    }

    const user = db.users[userIndex];

    db.users[userIndex] = {
      ...user,
      name: name ?? user.name,
      email: email ?? user.email,
      role: role ?? user.role,
    };

    writeDB(db);

    return NextResponse.json(
      { user: sanitizeUser(db.users[userIndex]) },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
