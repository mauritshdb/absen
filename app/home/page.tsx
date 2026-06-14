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
          className={`flex items-center justify-between px-4 py-3 transition-colors duration-500 ${insideRadius === false ? "bg-red-500" : "bg-[#3F8C75]"
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
            <p key={`in-${attendance?.clockIn}`} className="text-gray-800 font-semibold animate-popIn">
              {attendance?.clockIn ?? "-"}
            </p>
            <p key={`out-${attendance?.clockOut}`} className="text-gray-800 font-semibold animate-popIn">
              {attendance?.clockOut ?? "-"}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => setModalMode("in")}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#cfeede] text-gray-800 text-sm font-semibold py-2.5 transition-transform duration-150 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 6C8 3.79086 9.79086 2 12 2H17.5C19.9853 2 22 4.01472 22 6.5V17.5C22 19.9853 19.9853 22 17.5 22H12C9.79086 22 8 20.2091 8 18V17C8 16.4477 8.44772 16 9 16C9.55228 16 10 16.4477 10 17V18C10 19.1046 10.8954 20 12 20H17.5C18.8807 20 20 18.8807 20 17.5V6.5C20 5.11929 18.8807 4 17.5 4H12C10.8954 4 10 4.89543 10 6V7C10 7.55228 9.55228 8 9 8C8.44772 8 8 7.55228 8 7V6ZM12.2929 8.29289C12.6834 7.90237 13.3166 7.90237 13.7071 8.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L13.7071 15.7071C13.3166 16.0976 12.6834 16.0976 12.2929 15.7071C11.9024 15.3166 11.9024 14.6834 12.2929 14.2929L13.5858 13L5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11L13.5858 11L12.2929 9.70711C11.9024 9.31658 11.9024 8.68342 12.2929 8.29289Z" fill="#0F1729" />
              </svg>
              Clock in
            </button>
            <button
              onClick={() => setModalMode("out")}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#f8d6d6] text-gray-800 text-sm font-semibold py-2.5 transition-transform duration-150 active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6.5C2 4.01472 4.01472 2 6.5 2H12C14.2091 2 16 3.79086 16 6V7C16 7.55228 15.5523 8 15 8C14.4477 8 14 7.55228 14 7V6C14 4.89543 13.1046 4 12 4H6.5C5.11929 4 4 5.11929 4 6.5V17.5C4 18.8807 5.11929 20 6.5 20H12C13.1046 20 14 19.1046 14 18V17C14 16.4477 14.4477 16 15 16C15.5523 16 16 16.4477 16 17V18C16 20.2091 14.2091 22 12 22H6.5C4.01472 22 2 19.9853 2 17.5V6.5ZM18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289L22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071C17.9024 15.3166 17.9024 14.6834 18.2929 14.2929L19.5858 13L11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11L19.5858 11L18.2929 9.70711C17.9024 9.31658 17.9024 8.68342 18.2929 8.29289Z" fill="#0F1729" />
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
