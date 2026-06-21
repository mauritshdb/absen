"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SubPageHeader from "@/components/SubPageHeader";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function EditProfilePage() {
  const { user, setUser, loading } = useCurrentUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setError("");
    setSaved(false);
    setSaving(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Gagal menyimpan perubahan.");
        return;
      }

      setUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
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
      <SubPageHeader title="Edit Profile" />

      <div className="flex flex-col items-center mb-6">
        <Image
          src={user.avatar}
          alt={name}
          width={80}
          height={80}
          className="rounded-full bg-gray-200 mb-2"
          unoptimized
        />
        <button className="text-xs font-semibold text-[#3F8C75] transition-opacity hover:opacity-70">
          Ganti foto
        </button>
      </div>

      <label className="block text-sm text-gray-700 mb-1">Nama Lengkap</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md bg-[#F5F5F0] px-3 py-2.5 mb-4 text-sm text-gray-700 outline-none border border-transparent focus:border-[#3F8C75] transition-colors"
      />

      <label className="block text-sm text-gray-700 mb-1">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md bg-[#F5F5F0] px-3 py-2.5 mb-4 text-sm text-gray-700 outline-none border border-transparent focus:border-[#3F8C75] transition-colors"
      />

      <label className="block text-sm text-gray-700 mb-1">Jabatan</label>
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full rounded-md bg-[#F5F5F0] px-3 py-2.5 mb-6 text-sm text-gray-700 outline-none border border-transparent focus:border-[#3F8C75] transition-colors"
      />

      {error && (
        <p className="text-xs text-red-500 mb-4 animate-fadeIn">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-[#3F8C75] text-white font-semibold py-3 transition-transform duration-150 active:scale-[0.98] disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : "Simpan"}
      </button>

      {saved && (
        <div className="mt-4 text-center text-sm text-[#3F8C75] font-medium animate-fadeIn">
          Profil berhasil disimpan
        </div>
      )}

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
