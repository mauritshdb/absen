import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Absence",
  description: "Absence attendance app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#EFEFEF] flex items-start justify-center sm:items-center">
        <div className="relative w-full max-w-[390px] min-h-screen sm:min-h-[700px] bg-[#EFEFEF] px-6 py-10 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
