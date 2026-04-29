"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  quantityVenda: number;
  priceVenda: number | null;
}

interface Props {
  books: Book[];
  defaultBookId?: number;
}

interface FormData {
  bookId: number;
  quantity: number;
  priceEach: string;
  tipoPagamento: string;
  notes: string;
}

const TIPOS_PAGAMENTO = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "credito", label: "Crédito" },
  { value: "debito", label: "Débito" },
  { value: "outros", label: "Outros" },
];

export default function NovaVendaForm({ books, defaultBookId }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { bookId: defaultBookId ?? 0, quantity: 1, priceEach: "", tipoPagamento: "", notes: "" },
  });

  const bookIdValue = useWatch({ control, name: "bookId" });
  const notesValue = watch("notes");
  const selectedBook = books.find((b) => b.id === Number(bookIdValue));

  const formatPrice = (raw: string) => {
    const n = parseFloat(raw);
    if (isNaN(n)) return "";
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleBookChange = (id: number) => {
    const book = books.find((b) => b.id === id);
    const raw = book?.priceVenda != null ? String(book.priceVenda) : "";
    setValue("priceEach", raw);
    setPriceDisplay(formatPrice(raw));
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: data.bookId,
          quantity: data.quantity,
          priceEach: data.priceEach !== "" ? Number(data.priceEach) : null,
          tipoPagamento: data.tipoPagamento || null,
          notes: data.notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao registrar venda");
        return;
      }
      window.location.href = "/vendas";
    } finally {
      setSaving(false);
    }
  };

  const selectClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white";
  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {books.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-700">
          Não há livros disponíveis para venda no momento.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Livro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Livro <span className="text-red-500">*</span>
          </label>
          <select
            {...register("bookId", {
              validate: (v) => Number(v) > 0 || "Selecione um livro",
              onChange: (e) => handleBookChange(Number(e.target.value)),
            })}
            className={selectClass}
          >
            <option value={0}>Selecione um livro...</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author}
              </option>
            ))}
          </select>
          {errors.bookId && <p className="text-xs text-red-500 mt-1">{errors.bookId.message}</p>}
        </div>

        {/* Quantidade + Estoque na mesma linha */}
        <div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={selectedBook?.quantityVenda ?? undefined}
                {...register("quantity", {
                  required: "Informe a quantidade",
                  min: { value: 1, message: "Mínimo 1" },
                  validate: (v) =>
                    !selectedBook || Number(v) <= selectedBook.quantityVenda ||
                    `Máximo disponível: ${selectedBook.quantityVenda}`,
                })}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1.5">Em estoque para venda</label>
              <div className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 text-gray-600 min-h-[42px]">
                {selectedBook ? (
                  <span>
                    <span className="font-bold text-gray-800">{selectedBook.quantityVenda}</span>{" "}
                    exemplar{selectedBook.quantityVenda !== 1 ? "es" : ""}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
          </div>
          {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
        </div>

        {/* Tipo de Pagamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tipo de Pagamento <span className="text-red-500">*</span>
          </label>
          <select
            {...register("tipoPagamento", { required: "Selecione o tipo de pagamento" })}
            className={selectClass}
          >
            <option value="">Selecione...</option>
            {TIPOS_PAGAMENTO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.tipoPagamento && <p className="text-xs text-red-500 mt-1">{errors.tipoPagamento.message}</p>}
        </div>

        {/* Preço */}
        <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700">Preço</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Preço de tabela (R$)
              </label>
              <input
                type="text"
                readOnly
                value={
                  selectedBook?.priceVenda != null
                    ? Number(selectedBook.priceVenda).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                    : "—"
                }
                className={`${inputClass} bg-gray-100 text-gray-500 cursor-default`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Preço de venda (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={priceDisplay}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  setPriceDisplay(e.target.value);
                  setValue("priceEach", raw, { shouldValidate: true });
                }}
                onFocus={(e) => {
                  const raw = e.target.value.replace(/\./g, "").replace(",", ".");
                  setPriceDisplay(isNaN(parseFloat(raw)) ? "" : String(parseFloat(raw)));
                }}
                onBlur={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  setPriceDisplay(formatPrice(raw));
                }}
                className={inputClass}
              />
              <input type="hidden" {...register("priceEach", { min: { value: 0, message: "Valor inválido" } })} />
              <p className="text-xs text-gray-400 mt-1">Edite para registrar desconto.</p>
              {errors.priceEach && <p className="text-xs text-red-500 mt-1">{errors.priceEach.message}</p>}
            </div>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (opcional)</label>
          <textarea
            {...register("notes", { maxLength: { value: 500, message: "Máximo de 500 caracteres" } })}
            maxLength={500}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{notesValue?.length ?? 0}/500</p>
          {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes.message}</p>}
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
