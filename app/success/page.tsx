"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [info, setInfo] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("absence_last_registered");
    if (raw) {
      setInfo(JSON.parse(raw));
      sessionStorage.removeItem("absence_last_registered");
    }
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="text-center text-3xl font-bold text-[#3F8C75] tracking-wide mb-8">
        ABSENCE
      </h1>

      <div className="bg-[#7AC79E] rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#1F4F40]">
            Register Success
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-6 h-6 text-[#1F4F40]"
          >
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.5 2.5L16 9" />
          </svg>
        </div>

        <p className="text-sm font-semibold text-[#1F4F40]">Nama Lengkap</p>
        <p className="text-lg font-bold text-[#1F4F40] mb-4">
          {info?.name ?? "John Smith"}
        </p>

        <p className="text-sm font-semibold text-[#1F4F40]">Email</p>
        <p className="text-lg font-bold text-[#1F4F40] mb-6">
          {info?.email ?? "johnsmith@mail.com"}
        </p>

        <Link
          href="/"
          className="block w-full text-center rounded-md bg-[#3F8C75] text-white text-sm font-medium py-2.5 transition-transform duration-150 active:scale-[0.98]"
        >
          Kembali ke login
        </Link>
      </div>
    </div>
  );
}
