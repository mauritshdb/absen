"use client";

import { useState } from "react";
import SubPageHeader from "@/components/SubPageHeader";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? "bg-[#3F8C75]" : "bg-gray-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [locationReminder, setLocationReminder] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const items = [
    {
      label: "Notifikasi",
      desc: "Terima pengingat absen dan info penggajian",
      value: notifications,
      onChange: setNotifications,
    },
    {
      label: "Pengingat Lokasi",
      desc: "Ingatkan saat keluar dari radius sekolah",
      value: locationReminder,
      onChange: setLocationReminder,
    },
    {
      label: "Mode Gelap",
      desc: "Tampilan tema gelap untuk aplikasi",
      value: darkMode,
      onChange: setDarkMode,
    },
    {
      label: "Update via Email",
      desc: "Kirim slip gaji dan pengumuman ke email",
      value: emailUpdates,
      onChange: setEmailUpdates,
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen pb-10 bg-white -mx-6 -my-10 px-6 py-6">
      <SubPageHeader title="Settings" />

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        {items.map((item, idx) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-4 py-3.5 ${
              idx !== items.length - 1 ? "border-b border-gray-100" : ""
            }`}
            style={{
              animation: "fadeIn 0.35s ease forwards",
              animationDelay: `${idx * 60}ms`,
              opacity: 0,
            }}
          >
            <div className="pr-4">
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <Toggle checked={item.value} onChange={item.onChange} />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
