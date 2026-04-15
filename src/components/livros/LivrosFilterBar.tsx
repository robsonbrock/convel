"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface Props {
  initialLivro: string;
  currentSort: string;
  currentOrder: string;
}

export default function LivrosFilterBar({ initialLivro, currentSort, currentOrder }: Props) {
  const router = useRouter();
  const [livro, setLivro] = useState(initialLivro);

  const pushUrl = useCallback(
    (b: string) => {
      const params = new URLSearchParams();
      if (b) params.set("livro", b);
      if (currentSort) params.set("sort", currentSort);
      if (currentOrder) params.set("order", currentOrder);
      router.push(`/livros/emprestimo?${params.toString()}`);
    },
    [router, currentSort, currentOrder]
  );

  useEffect(() => {
    const t = setTimeout(() => pushUrl(livro), 400);
    return () => clearTimeout(t);
  }, [livro, pushUrl]);

  return (
    <div className="flex bg-white rounded-2xl shadow-sm px-4 py-3">
      <div className="relative flex items-center flex-1 min-w-48">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Filtrar por título ou autor..."
          value={livro}
          onChange={(e) => setLivro(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white placeholder:text-gray-400"
        />
        {livro && (
          <button
            onClick={() => setLivro("")}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
