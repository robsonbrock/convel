import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart, Plus } from "lucide-react";
import VendasClient from "@/components/vendas/VendasClient";
import { Prisma } from "@prisma/client";

type SortOrder = "asc" | "desc";

export default async function VendasPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string; livro?: string };
}) {
  const sort = searchParams.sort || "soldAt";
  const order: SortOrder = searchParams.order === "asc" ? "asc" : "desc";
  const livro = searchParams.livro?.trim() ?? "";

  let orderBy: Prisma.SaleOrderByWithRelationInput;
  if (sort === "bookTitle") {
    orderBy = { book: { title: order } };
  } else if (sort === "quantity") {
    orderBy = { quantity: order };
  } else if (sort === "notes") {
    orderBy = { notes: order };
  } else {
    orderBy = { soldAt: order };
  }

  const sales = await prisma.sale.findMany({
    where: livro
      ? {
          book: {
            OR: [
              { title: { contains: livro } },
              { author: { contains: livro } },
            ],
          },
        }
      : undefined,
    orderBy,
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

      {sales.length === 0 && !livro ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-12">
          <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">Nenhuma venda registrada ainda</p>
        </div>
      ) : (
        <VendasClient
          sales={sales}
          initialLivro={livro}
          currentSort={sort}
          currentOrder={order}
        />
      )}
    </div>
  );
}
