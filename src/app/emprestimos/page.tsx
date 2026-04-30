import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeftRight, Plus, CheckCircle } from "lucide-react";
import SortableHeader from "@/components/ui/SortableHeader";
import EmprestimosFilterBar from "@/components/emprestimos/EmprestimosFilterBar";
import EmprestimosTable from "@/components/emprestimos/EmprestimosTable";
import { Prisma } from "@prisma/client";
import { normalizeStr } from "@/lib/utils";

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

  const allLoans = await prisma.loan.findMany({
    where: { returnedAt: null },
    orderBy,
    include: { book: true, borrower: true },
  });

  const nLeitor = normalizeStr(leitor);
  const nLivro = normalizeStr(livro);

  const loans = allLoans.filter((l: (typeof allLoans)[number]) => {
    const leitorOk = !nLeitor || [l.borrower.name, l.borrower.cpf].some((f) => normalizeStr(f).includes(nLeitor));
    const livroOk = !nLivro || [l.book.title, l.book.author].some((f) => normalizeStr(f).includes(nLivro));
    return leitorOk && livroOk;
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
          <EmprestimosTable initialLoans={loans} currentSort={sort} currentOrder={order} />
        )}
      </div>
    </div>
  );
}
