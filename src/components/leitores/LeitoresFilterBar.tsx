"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface Props {
  initialLeitor: string;
  currentSort: string;
  currentOrder: string;
}

export default function LeitoresFilterBar({ initialLeitor, currentSort, currentOrder }: Props) {
  const router = useRouter();
  const [leitor, setLeitor] = useState(initialLeitor);

  const pushUrl = useCallback(
    (v: string) => {
      const params = new URLSearchParams();
      if (v) params.set("leitor", v);
      if (currentSort) params.set("sort", currentSort);
      if (currentOrder) params.set("order", currentOrder);
      router.push(`/leitores?${params.toString()}`);
    },
    [router, currentSort, currentOrder]
  );

  useEffect(() => {
    const t = setTimeout(() => pushUrl(leitor), 400);
    return () => clearTimeout(t);
  }, [leitor, pushUrl]);

  return (
    <div className="flex bg-white rounded-2xl shadow-sm px-4 py-3">
      <div className="relative flex items-center flex-1 min-w-48">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Filtrar por nome, CPF ou e-mail..."
          value={leitor}
          onChange={(e) => setLeitor(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white placeholder:text-gray-400"
        />
        {leitor && (
          <button
            onClick={() => setLeitor("")}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
