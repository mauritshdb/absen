import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB, findUserByEmail, sanitizeUser, generateId } from "@/lib/db";

const SYMBOL_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=]/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, birthDate, password } = body as {
      name?: string;
      email?: string;
      birthDate?: string;
      password?: string;
    };

    if (!name || !email || !birthDate || !password) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (!SYMBOL_REGEX.test(password)) {
      return NextResponse.json(
        { message: "Password harus menggunakan symbol." },
        { status: 400 }
      );
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const db = readDB();
    const newUser = {
      id: generateId(),
      name,
      email,
      password,
      birthDate,
      role: "SDM",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        name
      )}`,
      schedule: { start: "07:20", end: "14:00" },
      attendance: { date: "", clockIn: "-", clockOut: "-" },
    };

    db.users.push(newUser);
    writeDB(db);

    return NextResponse.json(
      { user: sanitizeUser(newUser) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
