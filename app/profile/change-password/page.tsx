"use client";

import { useState } from "react";
import SubPageHeader from "@/components/SubPageHeader";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function ChangePasswordPage() {
  const { user, loading } = useCurrentUser();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setError("");
    setSuccess(false);

    if (!current || !next || !confirm) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (next !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: current,
          newPassword: next,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Gagal mengubah password.");
        return;
      }

      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-[#7AC79E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen pb-10 bg-white -mx-6 -my-10 px-6 py-6">
      <SubPageHeader title="Change Password" />

      <label className="block text-sm text-gray-700 mb-1">Password Saat Ini</label>
      <input
        type="password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className="w-full rounded-md bg-[#F5F5F0] px-3 py-2.5 mb-4 text-sm text-gray-700 outline-none border border-transparent focus:border-[#3F8C75] transition-colors"
      />

      <label className="block text-sm text-gray-700 mb-1">Password Baru</label>
      <input
        type="password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className="w-full rounded-md bg-[#F5F5F0] px-3 py-2.5 mb-1 text-sm text-gray-700 outline-none border border-transparent focus:border-[#3F8C75] transition-colors"
      />
      <p className="text-xs text-gray-400 mb-4">password harus menggunakan symbol!</p>

      <label className="block text-sm text-gray-700 mb-1">Konfirmasi Password Baru</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full rounded-md bg-[#F5F5F0] px-3 py-2.5 mb-5 text-sm text-gray-700 outline-none border border-transparent focus:border-[#3F8C75] transition-colors"
      />

      {error && (
        <p className="text-xs text-red-500 mb-4 animate-fadeIn">{error}</p>
      )}
      {success && (
        <p className="text-xs text-[#3F8C75] font-medium mb-4 animate-fadeIn">
          Password berhasil diubah.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full rounded-xl bg-[#3F8C75] text-white font-semibold py-3 transition-transform duration-150 active:scale-[0.98] disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : "Ubah Password"}
      </button>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
