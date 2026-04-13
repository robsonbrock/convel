import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Plus, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import SortableHeader from "@/components/ui/SortableHeader";

type SortField = "title" | "author" | "type" | "quantity" | "createdAt";
type SortOrder = "asc" | "desc";

export default async function LivrosPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string };
}) {
  const sort = (searchParams.sort as SortField) || "title";
  const order: SortOrder = searchParams.order === "desc" ? "desc" : "asc";

  const validSorts: SortField[] = ["title", "author", "type", "quantity", "createdAt"];
  const safeSort: SortField = validSorts.includes(sort) ? sort : "title";

  const books = await prisma.book.findMany({
    orderBy: { [safeSort]: order },
    include: {
      _count: { select: { loans: { where: { returnedAt: null } } } },
    },
  });

  const sh = (column: SortField, label: string, className?: string) => (
    <SortableHeader
      column={column}
      label={label}
      basePath="/livros"
      currentSort={safeSort}
      currentOrder={order}
      className={className}
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Livros</h2>
          <p className="text-sm text-gray-500">{books.length} livro(s) cadastrado(s)</p>
        </div>
        <Link
          href="/livros/novo"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Livro
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum livro cadastrado ainda</p>
            <Link href="/livros/novo" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
              Cadastrar primeiro livro
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {sh("title", "Título")}
                {sh("author", "Autor", "hidden md:table-cell")}
                {sh("type", "Tipo")}
                {sh("quantity", "Qtd", "hidden lg:table-cell")}
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Disponíveis</th>
                {sh("createdAt", "Cadastrado em", "hidden lg:table-cell")}
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const available =
                  book.type === "EMPRESTIMO"
                    ? book.quantity - book._count.loans
                    : book.quantity;
                return (
                  <tr key={book.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{book.title}</p>
                      <p className="text-xs text-gray-400">{book.publisher} · {book.year}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{book.author}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          book.type === "EMPRESTIMO"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {book.type === "EMPRESTIMO" ? "Empréstimo" : "Venda"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{book.quantity}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`font-medium ${
                          available === 0 ? "text-red-500" : "text-gray-800"
                        }`}
                      >
                        {available}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{formatDate(book.createdAt)}</td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/livros/${book.id}/editar`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
