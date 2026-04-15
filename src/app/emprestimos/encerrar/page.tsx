"use client";

import { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCPF, daysSince } from "@/lib/utils";

interface Loan {
  id: number;
  loanedAt: string;
  book: { id: number; title: string; author: string };
  borrower: { id: number; name: string; cpf: string };
}

export default function EncerrarEmprestimoPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookFilter, setBookFilter] = useState("");
  const [borrowerFilter, setBorrowerFilter] = useState("");
  const [closing, setClosing] = useState<number | null>(null);
  const [success, setSuccess] = useState("");

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/emprestimos?status=active");
      const data = await res.json();
      setLoans(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const filtered = loans.filter((l) => {
    const bk = l.book.title.toLowerCase().includes(bookFilter.toLowerCase());
    const br = l.borrower.name.toLowerCase().includes(borrowerFilter.toLowerCase());
    return bk && br;
  });

  const handleClose = async (loanId: number) => {
    setClosing(loanId);
    setSuccess("");
    try {
      const res = await fetch("/api/emprestimos/encerrar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId }),
      });
      if (res.ok) {
        setLoans((prev) => prev.filter((l) => l.id !== loanId));
        setSuccess("Empréstimo encerrado com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } finally {
      setClosing(null);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/emprestimos" className="p-2 rounded-xl hover:bg-white text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Encerrar Empréstimo</h2>
          <p className="text-sm text-gray-500">Registre a devolução de um livro</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por livro..."
            value={bookFilter}
            onChange={(e) => setBookFilter(e.target.value)}
            className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por leitor..."
            value={borrowerFilter}
            onChange={(e) => setBorrowerFilter(e.target.value)}
            className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-sm text-gray-400">Carregando...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum empréstimo ativo encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Livro</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Leitor</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">CPF</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Emprestado em</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Dias</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((loan) => {
                const dias = daysSince(loan.loanedAt);
                return (
                  <tr key={loan.id} className="border-b border-gray-70 hover:bg-blue-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{loan.book.title}</p>
                      <p className="text-xs text-gray-400">{loan.book.author}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{loan.borrower.name}</td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{formatCPF(loan.borrower.cpf)}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(loan.loanedAt)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          dias > 30 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {dias}d
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleClose(loan.id)}
                        disabled={closing === loan.id}
                        className="flex items-center gap-1.5 bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {closing === loan.id ? "Encerrando..." : "Encerrar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
