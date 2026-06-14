"use client";

import { payrollHistory, formatCurrency, dummyUser } from "@/lib/data";
import BottomNav from "@/components/BottomNav";
import { useCurrentUser } from "@/lib/useCurrentUser";


export default function PayrollPage() {
  const latest = payrollHistory[0];
  const { user, loading } = useCurrentUser();

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-3 border-[#7AC79E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen pb-20 bg-white -mx-6 -my-10 px-6 py-6">
      <h1 className="text-lg font-bold text-gray-800 mb-1">Payroll</h1>
      <p className="text-xs text-gray-500 mb-5">{user.name} · {user.role}</p>

      {/* Latest salary highlight */}
      <div className="rounded-xl bg-[#3F8C75] px-4 py-5 mb-5 text-white transition-transform duration-300 hover:scale-[1.01]">
        <p className="text-xs opacity-80 mb-1">Gaji terakhir · {latest.month}</p>
        <p className="text-2xl font-bold mb-1">{formatCurrency(latest.amount)}</p>
        <p className="text-xs opacity-80">Dibayar pada {latest.paidOn}</p>
      </div>

      <h2 className="text-sm font-semibold text-gray-700 mb-3">Riwayat Gaji</h2>

      <div className="flex flex-col gap-3">
        {payrollHistory.map((item, idx) => (
          <div
            key={item.month}
            className="rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between transition-colors duration-200 hover:bg-[#F5F5F0]"
            style={{
              animation: `fadeIn 0.4s ease forwards`,
              animationDelay: `${idx * 60}ms`,
              opacity: 0,
            }}
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.month}</p>
              <p className="text-xs text-gray-500">Dibayar {item.paidOn}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">
                {formatCurrency(item.amount)}
              </p>
              <span className="text-[10px] font-medium text-[#3F8C75] bg-[#e6f5ee] rounded-full px-2 py-0.5">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <BottomNav />
    </div>
  );
}
