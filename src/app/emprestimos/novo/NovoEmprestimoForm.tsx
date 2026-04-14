"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  availableCopies: number;
}

interface Borrower {
  id: number;
  name: string;
  cpf: string;
}

interface Props {
  books: Book[];
  borrowers: Borrower[];
  defaultBookId?: number;
}

interface FormData {
  bookId: number;
  borrowerId: number;
  notes: string;
}

export default function NovoEmprestimoForm({ books, borrowers, defaultBookId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { bookId: defaultBookId ?? 0 },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/emprestimos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao registrar empréstimo");
        return;
      }
      window.location.href = "/emprestimos";
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white";

  const availableBooks = books.filter((b) => b.availableCopies > 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {availableBooks.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-700">
          Não há livros disponíveis para empréstimo no momento.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Book */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Livro <span className="text-red-500">*</span>
          </label>
          <select
            {...register("bookId", { required: "Selecione um livro", validate: (v) => Number(v) > 0 || "Selecione um livro" })}
            className={selectClass}
          >
            <option value={0}>Selecione um livro...</option>
            {availableBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author} ({b.availableCopies} disponível(is))
              </option>
            ))}
          </select>
          {errors.bookId && <p className="text-xs text-red-500 mt-1">{errors.bookId.message}</p>}
        </div>

        {/* Borrower */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Leitor <span className="text-red-500">*</span>
          </label>
          <select
            {...register("borrowerId", { required: "Selecione um leitor", validate: (v) => Number(v) > 0 || "Selecione um leitor" })}
            className={selectClass}
          >
            <option value={0}>Selecione um leitor...</option>
            {borrowers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.borrowerId && <p className="text-xs text-red-500 mt-1">{errors.borrowerId.message}</p>}
          <Link href="/leitores/novo" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
            + Cadastrar novo leitor
          </Link>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (opcional)</label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            placeholder="Ex: Leitor solicitou devolução em 15 dias"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Link
            href="/emprestimos"
            className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || availableBooks.length === 0}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Registrando..." : "Registrar Empréstimo"}
          </button>
        </div>
      </form>
    </div>
  );
}
