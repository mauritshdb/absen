"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useCurrentUser, clearSession } from "@/lib/useCurrentUser";

const PersonIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="12" cy="8" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" />
  </svg>
);

const SettingsIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="12" cy="12" r="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const LockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V8a4 4 0 018 0v3" />
  </svg>
);

const GlobeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
  </svg>
);

const SignOutIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 16l-4-4 4-4M5 12h11M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4" />
  </svg>
);

const ChevronIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const menuItems = [
    { label: "Edit Profile", href: "/profile/edit", icon: PersonIcon },
    { label: "Settings", href: "/profile/settings", icon: SettingsIcon },
    { label: "Change Password", href: "/profile/change-password", icon: LockIcon },
    { label: "Language", href: "/profile/language", icon: GlobeIcon },
  ];

  const handleSignOut = () => {
    clearSession();
    router.push("/");
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
      <h1 className="text-lg font-bold text-gray-800 mb-5">Profile</h1>

      {/* Profile summary */}
      <div className="flex items-center gap-3 mb-6 animate-fadeIn">
        <Image
          src={user.avatar}
          alt={user.name}
          width={56}
          height={56}
          className="rounded-full bg-gray-200"
          unoptimized
        />
        <div>
          <p className="text-base font-bold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <span className="inline-block mt-1 text-[10px] font-medium text-[#3F8C75] bg-[#e6f5ee] rounded-full px-2 py-0.5">
            {user.role}
          </span>
        </div>
      </div>

      {/* Menu list */}
      <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
        {menuItems.map((item, idx) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between px-4 py-3.5 text-sm text-gray-800 transition-colors duration-150 hover:bg-[#F5F5F0] active:bg-[#EFEFEF] ${
              idx !== menuItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-[#3F8C75]">{item.icon}</span>
              {item.label}
            </span>
            {ChevronIcon}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={() => setShowSignOutConfirm(true)}
        className="flex items-center gap-3 rounded-xl border border-red-200 px-4 py-3.5 text-sm font-semibold text-red-500 transition-colors duration-150 hover:bg-red-50 active:scale-[0.99]"
      >
        {SignOutIcon}
        Sign Out
      </button>

      {/* Sign out confirm modal */}
      {showSignOutConfirm && (
        <div className="absolute inset-0 z-30 flex items-center justify-center animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowSignOutConfirm(false)}
          />
          <div className="relative w-[85%] bg-white rounded-xl p-5 shadow-xl animate-popIn">
            <p className="text-base font-bold text-gray-800 mb-1">Sign Out</p>
            <p className="text-sm text-gray-500 mb-5">
              Apakah anda yakin ingin keluar dari akun ini?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 rounded-xl bg-gray-100 text-gray-700 font-semibold py-2.5 text-sm transition-transform duration-150 active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 rounded-xl bg-red-500 text-white font-semibold py-2.5 text-sm transition-transform duration-150 active:scale-[0.98]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease forwards;
        }
        .animate-popIn {
          animation: popIn 0.25s ease-out forwards;
        }
      `}</style>

      <BottomNav />
    </div>
  );
}
