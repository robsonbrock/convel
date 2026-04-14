"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  ShieldCheck,
  UserCircle,
  BookMarked,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_SESSION } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/livros/emprestimo", label: "Livros p/ Empréstimo", icon: BookOpen },
  { href: "/livros/venda", label: "Livros p/ Venda", icon: ShoppingCart },
  { href: "/leitores", label: "Leitores", icon: Users },
  { href: "/emprestimos", label: "Empréstimos", icon: ArrowLeftRight },
  { href: "/vendas", label: "Vendas", icon: ShoppingCart },
  { href: "/usuarios", label: "Usuários Admin", icon: ShieldCheck, superAdminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <BookMarked className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-800 text-lg">ConVEL</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          if (item.superAdminOnly && !MOCK_SESSION.isSuperAdmin) return null;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-green-50 text-green-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <item.icon className={cn("w-4 h-4", active ? "text-green-600" : "text-gray-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile link at bottom */}
      <Link
        href="/perfil"
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mt-auto",
          pathname.startsWith("/perfil")
            ? "bg-green-50 text-green-700"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        )}
      >
        <UserCircle className={cn("w-4 h-4", pathname.startsWith("/perfil") ? "text-green-600" : "text-gray-400")} />
        Meu Perfil
      </Link>

      {/* Footer card */}
      <div className="bg-blue-50 rounded-xl p-3 mt-2">
        <p className="text-xs font-semibold text-blue-700 mb-1">Centro Espírita</p>
        <p className="text-xs text-blue-500">Controle de Vendas e Empréstimos de Livros</p>
      </div>
    </aside>
  );
}
