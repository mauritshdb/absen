"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatScheduleDate } from "@/lib/data";
import AbsenModal from "@/components/AbsenModal";
import BottomNav from "@/components/BottomNav";
import LiveMap from "@/components/LiveMap";
import { useCurrentUser } from "@/lib/useCurrentUser";

type Attendance = { date: string; clockIn: string; clockOut: string };

export default function HomePage() {
  const { user, loading } = useCurrentUser();
  const [modalMode, setModalMode] = useState<"in" | "out" | null>(null);
  const [insideRadius, setInsideRadius] = useState<boolean | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [now, setNow] = useState(new Date());

  // Keep the displayed date/time live
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Initialize attendance once user loads
  useEffect(() => {
    if (user) setAttendance(user.attendance);
  }, [user]);

  // Poll the schedule/attendance endpoint for realtime sync
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/schedule?userId=${user.id}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setAttendance(data.attendance);
      } catch {
        // ignore network errors during polling
      }
    };

    poll();
    const interval = setInterval(poll, 8000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  const handleAttendanceUpdate = (updated: Attendance) => {
    setAttendance(updated);
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-[#7AC79E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen pb-20 bg-white -mx-6 -my-10 px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 animate-fadeIn">
        <Image
          src={user.avatar}
          alt={user.name}
          width={48}
          height={48}
          className="rounded-full bg-gray-200"
          unoptimized
        />
        <div>
          <p className="text-sm text-gray-600">Selamat siang,</p>
          <p className="text-base font-bold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </div>

      {/* Radius card with live map */}
      <div className="rounded-xl overflow-hidden bg-white border border-gray-200 mb-5 transition-shadow duration-300 hover:shadow-md">
        <div
          className={`flex items-center justify-between px-4 py-3 transition-colors duration-500 ${
            insideRadius === false ? "bg-red-500" : "bg-[#3F8C75]"
          }`}
        >
          <p className="text-white font-semibold text-sm">
            {insideRadius === false ? "Anda diluar radius" : "Anda didalam radius"}
          </p>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M5.5 9a7 7 0 0112.5-2.5M18.5 15a7 7 0 01-12.5 2.5" />
          </svg>
        </div>
        <LiveMap onStatusChange={(inside) => setInsideRadius(inside)} />
      </div>

      {/* Schedule card */}
      <div className="rounded-xl overflow-hidden bg-white border border-gray-200 transition-shadow duration-300 hover:shadow-md">
        <div className="bg-[#3F8C75] px-4 py-3">
          <p className="text-white font-semibold text-sm">
            Jadwal {formatScheduleDate(now)}
          </p>
        </div>
        <div className="bg-[#7AC79E] px-4 py-5 flex flex-col items-center">
          <p className="text-gray-800 font-bold mb-1">{user.role}</p>
          <p className="text-gray-700 text-sm mb-4">
            {user.schedule.start} - {user.schedule.end}
          </p>

          <p className="text-gray-700 text-sm mb-1">Anda absen pada</p>
          <div className="flex gap-10 mb-4 transition-all duration-300">
            <p key={attendance?.clockIn} className="text-gray-800 font-semibold animate-popIn">
              {attendance?.clockIn ?? "-"}
            </p>
            <p key={attendance?.clockOut} className="text-gray-800 font-semibold animate-popIn">
              {attendance?.clockOut ?? "-"}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => setModalMode("in")}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#cfeede] text-gray-800 text-sm font-semibold py-2.5 transition-transform duration-150 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 16l-4-4 4-4M5 12h11M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4" />
              </svg>
              Clock in
            </button>
            <button
              onClick={() => setModalMode("out")}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#f8d6d6] text-gray-800 text-sm font-semibold py-2.5 transition-transform duration-150 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 8l4 4-4 4M19 12H8M10 4H6a1 1 0 00-1 1v14a1 1 0 001 1h4" />
              </svg>
              Clock out
            </button>
          </div>
        </div>
      </div>

      {modalMode && (
        <AbsenModal
          mode={modalMode}
          userId={user.id}
          schedule={user.schedule}
          role={user.role}
          onClose={() => setModalMode(null)}
          onSuccess={handleAttendanceUpdate}
          insideRadiusHint={insideRadius}
        />
      )}

      <BottomNav />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease forwards;
        }
        .animate-popIn {
          animation: popIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
