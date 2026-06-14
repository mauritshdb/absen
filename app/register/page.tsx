"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !birthDate || !password) {
      setError("Semua field wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, birthDate, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Registrasi gagal.");
        return;
      }

      sessionStorage.setItem(
        "absence_last_registered",
        JSON.stringify({ name: data.user.name, email: data.user.email })
      );
      router.push("/success");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-center text-3xl font-bold text-[#3F8C75] tracking-wide mb-8">
        ABSENCE
      </h1>

      <div className="bg-[#7AC79E] rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-5">Register</h2>

        <label className="block text-sm text-white mb-1">Nama Lengkap</label>
        <input
          type="text"
          placeholder="Masukan nama lengkap anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md bg-[#F5F5F0] px-3 py-2 mb-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none border border-transparent focus:border-white transition-colors"
        />

        <label className="block text-sm text-white mb-1">Email</label>
        <input
          type="email"
          placeholder="Masukkan email anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md bg-[#F5F5F0] px-3 py-2 mb-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none border border-transparent focus:border-white transition-colors"
        />

        <label className="block text-sm text-white mb-1">Tanggal Lahir</label>
        <input
          type="date"
          placeholder="Masukkan tanggal lahir anda"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded-md bg-[#F5F5F0] px-3 py-2 mb-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none border border-transparent focus:border-white transition-colors"
        />

        <label className="block text-sm text-white mb-1">Password</label>
        <input
          type="password"
          placeholder="Masukkan password anda"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-[#F5F5F0] px-3 py-2 mb-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none border border-transparent focus:border-white transition-colors"
        />
        <p className="text-xs text-white mb-3">
          password harus menggunakan symbol!
        </p>

        {error && (
          <p className="text-xs text-red-100 bg-red-500/30 rounded-md px-2 py-1 mb-3 animate-fadeIn">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className="block w-full text-center rounded-md bg-[#3F8C75] text-white text-sm font-medium py-2.5 transition-transform duration-150 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Memproses..." : "DAFTAR"}
        </button>

        <p className="text-center text-xs text-white mt-3">
          sudah punya akun?{" "}
          <Link href="/" className="underline">
            Login
          </Link>
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
      `}</style>
    </div>
  );
}
