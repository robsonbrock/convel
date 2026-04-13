import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";

export const metadata: Metadata = {
  title: "ConVEL — Controle de Venda e Empréstimo de Livros",
  description: "Sistema de controle de livros para Centros Espíritas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#E8E9F0] antialiased">
        <div className="flex gap-4 p-4 min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <TopNav />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
