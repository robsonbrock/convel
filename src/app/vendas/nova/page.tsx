import { prisma } from "@/lib/prisma";
import NovaVendaForm from "./NovaVendaForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NovaVendaPage({
  searchParams,
}: {
  searchParams: Promise<{ bookId?: string }>;
}) {
  const params = await searchParams;

  const books = await prisma.book.findMany({
    where: { type: "VENDA", quantity: { gt: 0 } },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/vendas" className="p-2 rounded-xl hover:bg-white text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Registrar Venda</h2>
          <p className="text-sm text-gray-500">Registre a venda de um livro</p>
        </div>
      </div>

      <NovaVendaForm
        books={books}
        defaultBookId={params.bookId ? Number(params.bookId) : undefined}
      />
    </div>
  );
}
