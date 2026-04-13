import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeftRight, Plus, CheckCircle } from "lucide-react";
import { formatDate, daysSince, formatCPF } from "@/lib/utils";
import SortableHeader from "@/components/ui/SortableHeader";
import { Prisma } from "@prisma/client";

type SortOrder = "asc" | "desc";

export default async function EmprestimosPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string };
}) {
  const sort = searchParams.sort || "loanedAt";
  const order: SortOrder = searchParams.order === "asc" ? "asc" : "desc";

  let orderBy: Prisma.LoanOrderByWithRelationInput;
  if (sort === "bookTitle") {
    orderBy = { book: { title: order } };
  } else if (sort === "borrowerName") {
    orderBy = { borrower: { name: order } };
  } else if (sort === "borrowerCpf") {
    orderBy = { borrower: { cpf: order } };
  } else {
    orderBy = { loanedAt: order };
  }

  const loans = await prisma.loan.findMany({
    where: { returnedAt: null },
    orderBy,
    include: { book: true, borrower: true },
  });

  const sh = (column: string, label: string, className?: string) => (
    <SortableHeader
      column={column}
      label={label}
      basePath="/emprestimos"
      currentSort={sort}
      currentOrder={order}
      className={className}
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Empréstimos</h2>
          <p className="text-sm text-gray-500">{loans.length} empréstimo(s) ativo(s)</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/emprestimos/encerrar"
            className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Encerrar
          </Link>
          <Link
            href="/emprestimos/novo"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Emprestar
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loans.length === 0 ? (
          <div className="text-center py-12">
            <ArrowLeftRight className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum empréstimo ativo</p>
            <Link href="/emprestimos/novo" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
              Registrar empréstimo
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {sh("bookTitle", "Livro")}
                {sh("borrowerName", "Leitor")}
                {sh("borrowerCpf", "CPF", "hidden md:table-cell")}
                {sh("loanedAt", "Emprestado em")}
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Dias</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const dias = daysSince(loan.loanedAt);
                return (
                  <tr key={loan.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{loan.book.title}</p>
                      <p className="text-xs text-gray-400">{loan.book.author}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{loan.borrower.name}</td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{formatCPF(loan.borrower.cpf)}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(loan.loanedAt)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          dias > 30
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {dias}d
                      </span>
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
