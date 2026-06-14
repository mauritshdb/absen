"use client";

import { useRouter } from "next/navigation";

const BackIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
  </svg>
);

export default function SubPageHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-6 animate-fadeIn">
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="text-gray-700 transition-transform duration-150 active:scale-90"
      >
        {BackIcon}
      </button>
      <h1 className="text-lg font-bold text-gray-800">{title}</h1>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
