"use client";

import { formatDate } from "@/lib/utils";

interface Sale {
  id: number;
  quantity: number;
  priceEach: number | null;
  soldAt: string | Date;
  notes: string | null;
  operador: string | null;
  book: { title: string; author: string; priceVenda: number | null };
}

interface Props {
  sales: Sale[];
  showPrices: boolean;
}

function formatBRL(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function VendasTable({ sales, showPrices }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-5 py-3 text-gray-500 font-medium">Livro</th>
            <th className="text-left px-5 py-3 text-gray-500 font-medium">Data</th>
            <th className="text-left px-5 py-3 text-gray-500 font-medium">Qtd</th>
            <th className="text-left px-5 py-3 text-gray-500 font-medium">Preço tabela</th>
            {showPrices && (
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Preço vendido</th>
            )}
            <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Operador</th>
            <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Observações</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} className="border-b border-gray-70 hover:bg-blue-50">
              <td className="px-5 py-3">
                <p className="font-medium text-gray-800">{sale.book.title}</p>
                <p className="text-xs text-gray-400">{sale.book.author}</p>
              </td>
              <td className="px-5 py-3 text-gray-500">{formatDate(sale.soldAt)}</td>
              <td className="px-5 py-3 text-gray-700">{sale.quantity}</td>
              <td className="px-5 py-3 text-gray-500">R$ {formatBRL(sale.book.priceVenda)}</td>
              {showPrices && (
                <td className="px-5 py-3 text-gray-700 font-medium">R$ {formatBRL(sale.priceEach)}</td>
              )}
              <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{sale.operador ?? "—"}</td>
              <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{sale.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
