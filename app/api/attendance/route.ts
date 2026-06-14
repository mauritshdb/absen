import { NextRequest, NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, type } = body as { userId?: string; type?: "in" | "out" };

    if (!userId || (type !== "in" && type !== "out")) {
      return NextResponse.json(
        { message: "userId dan type ('in'|'out') wajib diisi." },
        { status: 400 }
      );
    }

    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
    }

    const now = new Date();
    const time = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateKey = now.toISOString().slice(0, 10);

    const user = db.users[userIndex];

    // Reset attendance if it's a new day
    if (user.attendance.date !== dateKey) {
      user.attendance = { date: dateKey, clockIn: "-", clockOut: "-" };
    }

    if (type === "in") {
      user.attendance.clockIn = time;
    } else {
      user.attendance.clockOut = time;
    }
    user.attendance.date = dateKey;

    writeDB(db);

    return NextResponse.json(
      { attendance: user.attendance, time },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
