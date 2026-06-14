"use client";

import { useState } from "react";
import { schoolLocation, distanceInMeters } from "@/lib/data";

type Step = "form" | "checking" | "success" | "error";

type Attendance = { date: string; clockIn: string; clockOut: string };

export default function AbsenModal({
  mode,
  userId,
  schedule,
  role,
  onClose,
  onSuccess,
  insideRadiusHint,
}: {
  mode: "in" | "out";
  userId: string;
  schedule: { start: string; end: string };
  role: string;
  onClose: () => void;
  onSuccess?: (attendance: Attendance) => void;
  insideRadiusHint?: boolean | null;
}) {
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");

  const submitAttendance = async () => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: mode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message ?? "Gagal menyimpan absensi.");
        setStep("error");
        return;
      }

      setSubmittedTime(data.time);
      onSuccess?.(data.attendance);
      setStep("success");
    } catch {
      setErrorMsg("Gagal terhubung ke server.");
      setStep("error");
    }
  };

  const handleSubmit = () => {
    setStep("checking");
    setErrorMsg("");

    if (!("geolocation" in navigator)) {
      setErrorMsg("Perangkat anda tidak mendukung GPS.");
      setStep("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = distanceInMeters(
          latitude,
          longitude,
          schoolLocation.latitude,
          schoolLocation.longitude
        );

        if (distance <= schoolLocation.radiusMeters) {
          submitAttendance();
        } else {
          setErrorMsg(
            `Anda berada di luar radius lokasi (${Math.round(
              distance
            )}m dari sekolah). Absen ditolak.`
          );
          setStep("error");
        }
      },
      () => {
        setErrorMsg("Gagal mengambil lokasi. Pastikan GPS aktif dan izin lokasi diberikan.");
        setStep("error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full bg-white rounded-t-2xl shadow-xl px-6 pt-5 pb-8 max-h-[85%] overflow-y-auto animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Absen</h2>
          <button onClick={onClose} aria-label="Close" className="transition-transform duration-150 active:scale-90">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {step === "form" && (
          <div className="flex flex-col items-center animate-fadeIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-28 h-28 text-gray-800 mb-2">
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" />
            </svg>

            <p className="text-base font-semibold text-gray-800 mb-1">
              {role}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {schedule.start} - {schedule.end}
            </p>

            {insideRadiusHint === false && (
              <p className="text-xs text-red-500 mb-4 text-center">
                Lokasi anda saat ini berada di luar radius sekolah.
              </p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-[#7AC79E] text-gray-800 font-semibold py-3 transition-transform duration-150 active:scale-[0.98]"
            >
              Submit
            </button>
          </div>
        )}

        {step === "checking" && (
          <div className="flex flex-col items-center py-10 animate-fadeIn">
            <div className="w-12 h-12 border-4 border-[#7AC79E] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-600">Memeriksa lokasi anda...</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center animate-popIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-28 h-28 text-[#3F8C75] mb-4">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.5 2.5L16 9" />
            </svg>

            <p className="text-base text-gray-800 mb-8 text-center">
              {mode === "in" ? "Absen berhasil pada" : "Clock out berhasil pada"}
              <br />
              <span className="font-semibold">{submittedTime}</span>
            </p>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#7AC79E] text-gray-800 font-semibold py-3 transition-transform duration-150 active:scale-[0.98]"
            >
              Close
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center animate-fadeIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-24 h-24 text-red-400 mb-4">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5M12 16h.01" />
            </svg>

            <p className="text-sm text-gray-700 mb-8 text-center">{errorMsg}</p>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setStep("form")}
                className="flex-1 rounded-xl bg-gray-200 text-gray-700 font-semibold py-3 transition-transform duration-150 active:scale-[0.98]"
              >
                Coba lagi
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#7AC79E] text-gray-800 font-semibold py-3 transition-transform duration-150 active:scale-[0.98]"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        .animate-popIn {
          animation: popIn 0.35s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
