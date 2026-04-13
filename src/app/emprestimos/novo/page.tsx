import { prisma } from "@/lib/prisma";
import NovoEmprestimoForm from "./NovoEmprestimoForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NovoEmprestimoPage({
  searchParams,
}: {
  searchParams: Promise<{ bookId?: string }>;
}) {
  const params = await searchParams;

  const [books, borrowers] = await Promise.all([
    prisma.book.findMany({
      where: { type: "EMPRESTIMO" },
      include: { _count: { select: { loans: { where: { returnedAt: null } } } } },
      orderBy: { title: "asc" },
    }),
    prisma.borrower.findMany({ orderBy: { name: "asc" } }),
  ]);

  const availableBooks = books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    availableCopies: b.quantity - b._count.loans,
  }));

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/emprestimos" className="p-2 rounded-xl hover:bg-white text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Emprestar um Livro</h2>
          <p className="text-sm text-gray-500">Registre um novo empréstimo</p>
        </div>
      </div>

      <NovoEmprestimoForm
        books={availableBooks}
        borrowers={borrowers}
        defaultBookId={params.bookId ? Number(params.bookId) : undefined}
      />
    </div>
  );
}
