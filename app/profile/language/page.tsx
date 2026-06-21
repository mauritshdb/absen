"use client";

import { useState } from "react";
import SubPageHeader from "@/components/SubPageHeader";

const languages = [
  { code: "id", label: "Bahasa Indonesia", native: "Indonesia" },
  { code: "en", label: "English", native: "English" },
];

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5 text-[#3F8C75]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
  </svg>
);

export default function LanguagePage() {
  const [selected, setSelected] = useState("id");

  return (
    <div className="relative flex flex-col min-h-screen pb-10 bg-white -mx-6 -my-10 px-6 py-6">
      <SubPageHeader title="Language" />

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {languages.map((lang, idx) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-150 ${
              idx !== languages.length - 1 ? "border-b border-gray-100" : ""
            } ${selected === lang.code ? "bg-[#e6f5ee]" : "hover:bg-[#F5F5F0]"}`}
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">{lang.label}</p>
              <p className="text-xs text-gray-500">{lang.native}</p>
            </div>
            {selected === lang.code && (
              <span className="animate-popIn">{CheckIcon}</span>
            )}
          </button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-popIn {
          animation: popIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
