"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setSessionUserId } from "@/lib/useCurrentUser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Login gagal.");
        return;
      }

      setSessionUserId(data.user.id);
      router.push("/home");
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
        <h2 className="text-2xl font-bold text-white mb-5">LOGIN</h2>

        <label className="block text-sm text-white mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md bg-[#F5F5F0] px-3 py-2 mb-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none border border-transparent focus:border-white transition-colors"
        />

        <label className="block text-sm text-white mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-[#F5F5F0] px-3 py-2 mb-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none border border-transparent focus:border-white transition-colors"
        />

        {error && (
          <p className="text-xs text-red-100 bg-red-500/30 rounded-md px-2 py-1 mb-3 animate-fadeIn">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-md bg-[#3F8C75] text-white text-sm font-medium py-2.5 mb-3 transition-transform duration-150 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Memproses..." : "LOGIN"}
        </button>

        <p className="text-center text-xs text-white">
          belum punya akun?{" "}
          <Link href="/register" className="underline">
            Daftar
          </Link>
        </p>

        <p className="text-center text-[10px] text-white/70 mt-3">
          Demo: janedoe@mail.com / !Password123
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
