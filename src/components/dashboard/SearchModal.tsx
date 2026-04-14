"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, ShoppingCart, ArrowLeftRight } from "lucide-react";

interface BookResult {
  id: number;
  title: string;
  author: string;
  quantityEmprestimo: number;
  quantityVenda: number;
  availableCopies: number;
  activeLoansCount: number;
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/busca?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.books ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const navigate = (href: string) => {
    router.push(href);
    handleClose();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-gray-400 text-sm shadow-sm hover:shadow-md transition-shadow w-64"
      >
        <Search className="w-4 h-4" />
        <span>Buscar livro pelo nome...</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Digite o nome ou autor do livro..."
                value={query}
                onChange={handleChange}
                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && <p className="text-center py-8 text-sm text-gray-400">Buscando...</p>}
              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="text-center py-8 text-sm text-gray-400">
                  Nenhum livro encontrado para &quot;{query}&quot;
                </p>
              )}
              {!loading && query.length < 2 && (
                <p className="text-center py-8 text-sm text-gray-400">
                  Digite pelo menos 2 caracteres para buscar
                </p>
              )}
              {results.map((book) => (
                <div
                  key={book.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {book.quantityEmprestimo > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">
                          Empréstimo: {book.availableCopies}/{book.quantityEmprestimo} disp.
                        </span>
                      )}
                      {book.quantityVenda > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-green-50 text-green-600">
                          Venda: {book.quantityVenda} em estoque
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {book.quantityEmprestimo > 0 && book.availableCopies > 0 && (
                      <button
                        onClick={() => navigate(`/emprestimos/novo?bookId=${book.id}`)}
                        className="flex items-center gap-1 bg-blue-600 text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        Emprestar
                      </button>
                    )}
                    {book.quantityVenda > 0 && (
                      <button
                        onClick={() => navigate(`/vendas/nova?bookId=${book.id}`)}
                        className="flex items-center gap-1 bg-green-600 text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Vender
                      </button>
                    )}
                    {book.activeLoansCount > 0 && (
                      <button
                        onClick={() => navigate(`/emprestimos?livro=${encodeURIComponent(book.title)}`)}
                        className="flex items-center gap-1 bg-orange-50 text-orange-600 text-xs px-2.5 py-1.5 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        Ver Empréstimos ({book.activeLoansCount})
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
