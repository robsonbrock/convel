"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  quantity: number;
}

interface Props {
  books: Book[];
  defaultBookId?: number;
}

interface FormData {
  bookId: number;
  quantity: number;
  notes: string;
}

export default function NovaVendaForm({ books, defaultBookId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { bookId: defaultBookId ?? 0, quantity: 1 },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao registrar venda");
        return;
      }
      router.push("/vendas");
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {books.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-700">
          Não há livros disponíveis para venda no momento.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Livro <span className="text-red-500">*</span>
          </label>
          <select
            {...register("bookId", { validate: (v) => Number(v) > 0 || "Selecione um livro" })}
            className={selectClass}
          >
            <option value={0}>Selecione um livro...</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author} ({b.quantity} em estoque)
              </option>
            ))}
          </select>
          {errors.bookId && <p className="text-xs text-red-500 mt-1">{errors.bookId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Quantidade <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={1}
            {...register("quantity", {
              required: "Informe a quantidade",
              min: { value: 1, message: "Mínimo 1" },
            })}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (opcional)</label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex gap-3 pt-2">
          <Link
            href="/vendas"
            className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || books.length === 0}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Registrando..." : "Registrar Venda"}
          </button>
        </div>
      </form>
    </div>
  );
}
