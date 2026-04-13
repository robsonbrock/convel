import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function LivrosPage() {
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
    include: {
      _count: { select: { loans: { where: { returnedAt: null } } } },
    },
  });

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
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Título</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">Autor</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Tipo</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Qtd</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Disponíveis</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Cadastrado em</th>
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
