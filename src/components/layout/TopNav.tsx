import { Search, Bell } from "lucide-react";
import { MOCK_SESSION } from "@/lib/auth";

export default function TopNav() {
  return (
    <header className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-sm font-medium text-gray-400">ConVEL</h1>
        <p className="text-xs text-gray-400">Controle de Venda e Empréstimo de Livros</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
          <Bell className="w-4 h-4" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
            {MOCK_SESSION.fullName.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{MOCK_SESSION.fullName}</p>
            <p className="text-xs text-gray-400">{MOCK_SESSION.isSuperAdmin ? "Super Admin" : "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
