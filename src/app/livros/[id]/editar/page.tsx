"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BookFormData {
  title: string;
  author: string;
  publisher: string;
  year: number;
  isbn: string;
  quantity: number;
  type: "VENDA" | "EMPRESTIMO";
}

export default function EditarLivroPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookFormData>();

  useEffect(() => {
    fetch(`/api/livros/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset({
          title: data.title,
          author: data.author,
          publisher: data.publisher,
          year: data.year,
          isbn: data.isbn ?? "",
          quantity: data.quantity,
          type: data.type,
        });
        setLoading(false);
      });
  }, [id, reset]);

  const onSubmit = async (data: BookFormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/livros/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao salvar");
        return;
      }
      window.location.href = "/livros";
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/livros" className="p-2 rounded-xl hover:bg-white text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Editar Livro</h2>
          <p className="text-sm text-gray-500">Atualize os dados do livro</p>
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
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              {...register("author", { required: "Autor é obrigatório" })}
              className={inputClass}
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Editora <span className="text-red-500">*</span>
              </label>
              <input
                {...register("publisher", { required: "Editora é obrigatória" })}
                className={inputClass}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ISBN (opcional)</label>
              <input {...register("isbn")} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                {...register("quantity", { required: "Quantidade é obrigatória", min: { value: 1, message: "Mínimo 1" } })}
                className={inputClass}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="EMPRESTIMO" {...register("type", { required: true })} className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">📚 Empréstimo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="VENDA" {...register("type", { required: true })} className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">🛒 Venda</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/livros"
              className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
