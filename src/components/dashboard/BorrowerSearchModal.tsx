"use client";

import { useState, useCallback } from "react";
import { Search, X, Users, ArrowLeftRight } from "lucide-react";
import { formatCPF, daysSince } from "@/lib/utils";

interface ActiveLoan {
  id: number;
  loanedAt: string;
  book: { title: string };
}

interface BorrowerResult {
  id: number;
  name: string;
  cpf: string;
  loans: ActiveLoan[];
}

export default function BorrowerSearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BorrowerResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/busca?leitor=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.borrowers ?? []);
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 text-gray-400 text-sm shadow-sm hover:shadow-md transition-shadow w-64"
      >
        <Users className="w-4 h-4" />
        <span>Buscar leitor...</span>
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
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Nome ou CPF do leitor..."
                value={query}
                onChange={handleChange}
                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400"
              />
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <p className="text-center py-8 text-sm text-gray-400">Buscando...</p>
              )}
              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="text-center py-8 text-sm text-gray-400">
                  Nenhum leitor encontrado para &quot;{query}&quot;
                </p>
              )}
              {!loading && query.length < 2 && (
                <p className="text-center py-8 text-sm text-gray-400">
                  Digite pelo menos 2 caracteres para buscar
                </p>
              )}
              {results.map((b) => (
                <div key={b.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{b.name}</p>
                      <p className="text-xs text-gray-500">{formatCPF(b.cpf)}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        b.loans.length > 0
                          ? "bg-orange-50 text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b.loans.length} empréstimo(s) ativo(s)
                    </span>
                  </div>
                  {b.loans.length > 0 && (
                    <div className="mt-2 pl-11 space-y-1">
                      {b.loans.map((loan) => (
                        <div key={loan.id} className="flex items-center gap-2 text-xs text-gray-500">
                          <ArrowLeftRight className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate">{loan.book.title}</span>
                          <span
                            className={`shrink-0 font-medium ${
                              daysSince(new Date(loan.loanedAt)) > 30 ? "text-red-500" : "text-gray-400"
                            }`}
                          >
                            {daysSince(new Date(loan.loanedAt))}d
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
