import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "userId wajib diisi." }, { status: 400 });
  }

  const user = findUserById(userId);

  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(
    {
      schedule: user.schedule,
      attendance: user.attendance,
      serverTime: new Date().toISOString(),
    },
    { status: 200 }
  );
}
