"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
}

function formatBRL(value: number | null | undefined): string {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function VendasTable({ sales }: Props) {
  const [showPrices, setShowPrices] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {sales.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Nenhuma venda registrada ainda</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end px-5 pt-3 pb-1">
            <button
              onClick={() => setShowPrices((v) => !v)}
              title={showPrices ? "Ocultar valores de venda" : "Exibir valores de venda"}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              {showPrices ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPrices ? "Ocultar valores" : "Exibir valores"}
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Livro</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Qtd</th>
                {showPrices && (
                  <>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Preço tabela</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">Preço vendido</th>
                  </>
                )}
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Data</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Operador</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Observações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{sale.book.title}</p>
                    <p className="text-xs text-gray-400">{sale.book.author}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700">{sale.quantity}</td>
                  {showPrices && (
                    <>
                      <td className="px-5 py-3 text-gray-500">R$ {formatBRL(sale.book.priceVenda)}</td>
                      <td className="px-5 py-3 text-gray-700 font-medium">R$ {formatBRL(sale.priceEach)}</td>
                    </>
                  )}
                  <td className="px-5 py-3 text-gray-500">{formatDate(sale.soldAt)}</td>
                  <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{sale.operador ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{sale.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
