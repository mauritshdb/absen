import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

const SYMBOL_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=]/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, currentPassword, newPassword } = body as {
      userId?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (!SYMBOL_REGEX.test(newPassword)) {
      return NextResponse.json(
        { message: "Password baru harus menggunakan symbol." },
        { status: 400 }
      );
    }

    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
    }

    if (db.users[userIndex].password !== currentPassword) {
      return NextResponse.json(
        { message: "Password saat ini salah." },
        { status: 401 }
      );
    }

    db.users[userIndex].password = newPassword;
    writeDB(db);

    return NextResponse.json({ message: "Password berhasil diubah." }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
