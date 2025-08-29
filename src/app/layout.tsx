import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Image from "next/image";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Supervisores KL Facilities",
  description: "Relatório de Supervisão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${figtree.className} antialiased min-h-screen bg-gradient-to-br from-[#f7faff] via-[#eef2ff] to-white`}
      >
        <header className="w-full border-b  border-black/10">
          <div className="mx-auto max-w-2xl px-4 py-2">
            <div className="relative p-4 rounded border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-xl">
              <a
                href="https://klfacilities.com.br"
                aria-label="Ir para KL Facilities"
              >
                <Image
                  src="/logo-kl-light.png"
                  alt="ERP KL"
                  width={80}
                  height={80}
                  className="relative z-10"
                  priority
                />
              </a>
            </div>
          </div>
        </header>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
