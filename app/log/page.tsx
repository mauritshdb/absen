"use client";

import { attendanceLog, dummyUser } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import { useCurrentUser } from "@/lib/useCurrentUser";


const statusStyles: Record<string, string> = {
  "Tepat waktu": "text-[#3F8C75] bg-[#e6f5ee]",
  Terlambat: "text-red-600 bg-red-50",
  Izin: "text-yellow-600 bg-yellow-50",
};

export default function AbsenceLogPage() {
  const { user, loading } = useCurrentUser();

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-[#7AC79E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen pb-20 bg-white -mx-6 -my-10 px-6 py-6">
      <h1 className="text-lg font-bold text-gray-800 mb-1">Absence Log</h1>
      <p className="text-xs text-gray-500 mb-5">
        {user.name} · {user.role}
      </p>

      <div className="flex flex-col gap-3">
        {attendanceLog.map((item, idx) => (
          <div
            key={item.date}
            className="rounded-xl border border-gray-200 px-4 py-3 transition-colors duration-200 hover:bg-[#F5F5F0]"
            style={{
              animation: "fadeIn 0.4s ease forwards",
              animationDelay: `${idx * 60}ms`,
              opacity: 0,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.date}</p>
                <p className="text-xs text-gray-500">{item.day}</p>
              </div>
              <span
                className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                  statusStyles[item.status] ?? "text-gray-600 bg-gray-100"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="flex gap-8 text-sm">
              <div>
                <p className="text-xs text-gray-500">Clock in</p>
                <p className="font-semibold text-gray-800">{item.clockIn}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Clock out</p>
                <p className="font-semibold text-gray-800">{item.clockOut}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <BottomNav />
    </div>
  );
}
