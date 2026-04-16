"use client";

import { useState } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import { formatDate, daysSince, formatCPF } from "@/lib/utils";
import SortableHeader from "@/components/ui/SortableHeader";

interface Loan {
  id: number;
  loanedAt: string | Date;
  returnedAt: string | Date | null;
  notes: string | null;
  operador: string | null;
  book: { id: number; title: string; author: string };
  borrower: { id: number; name: string; cpf: string };
}

interface Props {
  initialLoans: Loan[];
  currentSort: string;
  currentOrder: "asc" | "desc";
}

export default function EmprestimosTable({ initialLoans, currentSort, currentOrder }: Props) {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);
  const [closing, setClosing] = useState<number | null>(null);
  const [renewing, setRenewing] = useState<number | null>(null);

  const handleClose = async (loanId: number) => {
    setClosing(loanId);
    try {
      const res = await fetch("/api/emprestimos/encerrar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId }),
      });
      if (res.ok) {
        setLoans((prev) => prev.filter((l) => l.id !== loanId));
      }
    } finally {
      setClosing(null);
    }
  };

  const handleRenew = async (loanId: number) => {
    setRenewing(loanId);
    try {
      const res = await fetch(`/api/emprestimos/${loanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "renew" }),
      });
      if (res.ok) {
        const updated: Loan = await res.json();
        setLoans((prev) => prev.map((l) => (l.id === loanId ? updated : l)));
      }
    } finally {
      setRenewing(null);
    }
  };

  if (loans.length === 0) {
    return null;
  }

  const sh = (column: string, label: string, className?: string) => (
    <SortableHeader
      column={column}
      label={label}
      basePath="/emprestimos"
      currentSort={currentSort}
      currentOrder={currentOrder}
      className={className}
    />
  );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100">
          {sh("bookTitle", "Livro")}
          {sh("borrowerName", "Leitor")}
          {sh("borrowerCpf", "CPF", "hidden md:table-cell")}
          {sh("loanedAt", "Emprestado em")}
          <th className="text-left px-5 py-3 text-gray-500 font-medium">Dias</th>
          <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Observações</th>
          <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Operador</th>
          <th className="text-left px-5 py-3 text-gray-500 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((loan) => {
          const dias = daysSince(loan.loanedAt);
          const notesShort = loan.notes && loan.notes.length > 35
            ? loan.notes.slice(0, 35) + "…"
            : loan.notes;
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
              <td
                className="px-5 py-3 text-gray-400 hidden lg:table-cell max-w-[180px] truncate"
                title={loan.notes ?? undefined}
              >
                {notesShort ?? "—"}
              </td>
              <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{loan.operador ?? "—"}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRenew(loan.id)}
                    disabled={renewing === loan.id || closing === loan.id}
                    title="Renovar empréstimo"
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {renewing === loan.id ? "..." : "Renovar"}
                  </button>
                  <button
                    onClick={() => handleClose(loan.id)}
                    disabled={closing === loan.id || renewing === loan.id}
                    title="Encerrar empréstimo"
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3 h-3" />
                    {closing === loan.id ? "..." : "Encerrar"}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
