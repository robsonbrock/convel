"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  quantityEmprestimo: number;
  quantityVenda: number;
}

export default function NovoLivroPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    defaultValues: { year: new Date().getFullYear(), quantityEmprestimo: 0, quantityVenda: 0 },
  });

  const onSubmit = async (data: BookFormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao salvar livro");
        return;
      }
      window.location.href = "/livros/emprestimo";
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300";

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/livros/emprestimo" className="p-2 rounded-xl hover:bg-white text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Cadastrar Livro</h2>
          <p className="text-sm text-gray-500">Adicione um novo livro ao acervo</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: "Título é obrigatório", minLength: { value: 2, message: "Mínimo 2 caracteres" } })}
              className={inputClass}
              placeholder="Ex: O Evangelho Segundo o Espiritismo"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              {...register("author", { required: "Autor é obrigatório", minLength: { value: 2, message: "Mínimo 2 caracteres" } })}
              className={inputClass}
              placeholder="Ex: Allan Kardec"
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Editora <span className="text-red-500">*</span>
              </label>
              <input
                {...register("publisher", { required: "Editora é obrigatória", minLength: { value: 2, message: "Mínimo 2 caracteres" } })}
                className={inputClass}
                placeholder="Ex: FEB"
              />
              {errors.publisher && <p className="text-xs text-red-500 mt-1">{errors.publisher.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Ano <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("year", {
                  required: "Ano é obrigatório",
                  min: { value: 1800, message: "Ano inválido" },
                  max: { value: new Date().getFullYear(), message: "Ano inválido" },
                })}
                className={inputClass}
              />
              {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ISBN (opcional)</label>
            <input {...register("isbn")} className={inputClass} placeholder="Ex: 9788589233330" />
          </div>

          {/* Quantities */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700">Exemplares disponíveis <span className="text-red-500">*</span></p>
            <p className="text-xs text-gray-500 -mt-2">Um mesmo livro pode ter exemplares para empréstimo e para venda simultaneamente.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  📚 Qtd para Empréstimo
                </label>
                <input
                  type="number"
                  min={0}
                  {...register("quantityEmprestimo", { min: { value: 0, message: "Mínimo 0" } })}
                  className={inputClass}
                />
                {errors.quantityEmprestimo && <p className="text-xs text-red-500 mt-1">{errors.quantityEmprestimo.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  🛒 Qtd para Venda
                </label>
                <input
                  type="number"
                  min={0}
                  {...register("quantityVenda", { min: { value: 0, message: "Mínimo 0" } })}
                  className={inputClass}
                />
                {errors.quantityVenda && <p className="text-xs text-red-500 mt-1">{errors.quantityVenda.message}</p>}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/livros/emprestimo"
              className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar Livro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
