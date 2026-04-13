import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function VendasPage() {
  const sales = await prisma.sale.findMany({
    orderBy: { soldAt: "desc" },
    include: { book: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vendas</h2>
          <p className="text-sm text-gray-500">{sales.length} venda(s) registrada(s)</p>
        </div>
        <Link
          href="/vendas/nova"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Venda
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {sales.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhuma venda registrada ainda</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Livro</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Quantidade</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Data</th>
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
                  <td className="px-5 py-3 text-gray-500">{formatDate(sale.soldAt)}</td>
                  <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{sale.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
