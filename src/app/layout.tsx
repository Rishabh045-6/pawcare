import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PawCare",
  description: "Find the right care for your animal, right when they need it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-orange-100 selection:text-orange-900`}>
        <Header />
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
          {children}
        </main>
        <Toaster position="bottom-center" toastOptions={{
          className: 'bg-slate-900 text-white border-none rounded-xl shadow-lg',
        }} />
      </body>
    </html>
  );
}
