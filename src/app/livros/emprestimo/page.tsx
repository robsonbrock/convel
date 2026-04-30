import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Plus, Pencil, ArrowLeftRight, ShoppingCart } from "lucide-react";
import { formatDate, normalizeStr } from "@/lib/utils";
import SortableHeader from "@/components/ui/SortableHeader";
import LivrosFilterBar from "@/components/livros/LivrosFilterBar";

type SortField = "title" | "author" | "quantityEmprestimo" | "quantityVenda" | "createdAt";
type SortOrder = "asc" | "desc";

export default async function LivrosPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string; livro?: string };
}) {
  const sort = (searchParams.sort as SortField) || "title";
  const order: SortOrder = searchParams.order === "desc" ? "desc" : "asc";
  const livro = searchParams.livro?.trim() ?? "";
  const validSorts: SortField[] = ["title", "author", "quantityEmprestimo", "quantityVenda", "createdAt"];
  const safeSort: SortField = validSorts.includes(sort) ? sort : "title";

  const allBooks = await prisma.book.findMany({
    where: { OR: [{ quantityEmprestimo: { gt: 0 } }, { quantityVenda: { gt: 0 } }] },
    orderBy: { [safeSort]: order },
    include: { _count: { select: { loans: { where: { returnedAt: null } } } } },
  });

  const nLivro = normalizeStr(livro);
  const books = nLivro
    ? allBooks.filter((b: (typeof allBooks)[number]) => [b.title, b.author].some((f) => normalizeStr(f).includes(nLivro)))
    : allBooks;

  const sh = (column: SortField, label: string, className?: string) => (
    <SortableHeader
      column={column}
      label={label}
      basePath="/livros/emprestimo"
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
          <p className="text-sm text-gray-500">{books.length} título(s) cadastrado(s)</p>
        </div>
        <Link
          href="/livros/novo"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo Livro
        </Link>
      </div>

      <LivrosFilterBar initialLivro={livro} currentSort={safeSort} currentOrder={order} />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum livro cadastrado</p>
            <Link href="/livros/novo" className="text-sm text-green-600 hover:underline mt-1 inline-block">
              Cadastrar livro
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {sh("title", "Título")}
                {sh("author", "Autor", "hidden md:table-cell")}
                {sh("quantityEmprestimo", "Qtd Emp.")}
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Disp. Emp.</th>
                {sh("quantityVenda", "Qtd Venda")}
                {sh("createdAt", "Cadastrado em", "hidden lg:table-cell")}
                <th className="px-3 py-3 text-center text-gray-500 font-medium text-xs">Emprestar</th>
                <th className="px-3 py-3 text-center text-gray-500 font-medium text-xs">Vender</th>
                <th className="px-3 py-3 text-center text-gray-500 font-medium text-xs">Editar</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book: (typeof books)[number]) => {
                const available = book.quantityEmprestimo - book._count.loans;
                return (
                  <tr key={book.id} className="border-b border-gray-70 hover:bg-blue-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{book.title}</p>
                      <p className="text-xs text-gray-400">{book.publisher} · {book.year}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{book.author}</td>
                    <td className="px-5 py-3 text-gray-600">{book.quantityEmprestimo}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${available === 0 ? "text-red-500" : "text-gray-800"}`}>
                        {available}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{book.quantityVenda}</td>
                    <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{formatDate(book.createdAt)}</td>
                    <td className="px-3 py-3 text-center">
                      {available > 0 ? (
                        <Link
                          href={`/emprestimos/novo?bookId=${book.id}`}
                          title="Emprestar"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <ArrowLeftRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 text-gray-300" title="Sem exemplares disponíveis">
                          <ArrowLeftRight className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {book.quantityVenda > 0 ? (
                        <Link
                          href={`/vendas/nova?bookId=${book.id}`}
                          title="Vender"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 text-gray-300" title="Sem estoque para venda">
                          <ShoppingCart className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Link
                        href={`/livros/${book.id}/editar`}
                        title="Editar"
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
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
