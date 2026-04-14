import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeftRight, Plus, CheckCircle } from "lucide-react";
import SortableHeader from "@/components/ui/SortableHeader";
import EmprestimosFilterBar from "@/components/emprestimos/EmprestimosFilterBar";
import EmprestimosTable from "@/components/emprestimos/EmprestimosTable";
import { Prisma } from "@prisma/client";

type SortOrder = "asc" | "desc";

export default async function EmprestimosPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string; leitor?: string; livro?: string };
}) {
  const sort = searchParams.sort || "loanedAt";
  const order: SortOrder = searchParams.order === "asc" ? "asc" : "desc";
  const leitor = searchParams.leitor?.trim() ?? "";
  const livro = searchParams.livro?.trim() ?? "";

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
    where: {
      returnedAt: null,
      ...(leitor
        ? {
            borrower: {
              OR: [
                { name: { contains: leitor } },
                { cpf: { contains: leitor } },
              ],
            },
          }
        : {}),
      ...(livro
        ? {
            book: {
              OR: [
                { title: { contains: livro } },
                { author: { contains: livro } },
              ],
            },
          }
        : {}),
    },
    orderBy,
    include: { book: true, borrower: true },
  });

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

      <EmprestimosFilterBar
        initialLeitor={leitor}
        initialLivro={livro}
        currentSort={sort}
        currentOrder={order}
      />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loans.length === 0 ? (
          <div className="text-center py-12">
            <ArrowLeftRight className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">
              {leitor || livro ? "Nenhum empréstimo encontrado para esse filtro" : "Nenhum empréstimo ativo"}
            </p>
            {!leitor && !livro && (
              <Link href="/emprestimos/novo" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                Registrar empréstimo
              </Link>
            )}
          </div>
        ) : (
          <EmprestimosTable initialLoans={loans} />
        )}
      </div>
    </div>
  );
}
