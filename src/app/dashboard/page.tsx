import { prisma } from "@/lib/prisma";
import { BookOpen, ArrowLeftRight, ShoppingCart, BookMarked } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import SearchModal from "@/components/dashboard/SearchModal";
import BorrowerSearchModal from "@/components/dashboard/BorrowerSearchModal";
import { formatDate, daysSince } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const [
    totalBooks,
    activeLoansCount,
    totalSalesCount,
    latestLoans,
    latestSales,
    booksForLoan,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.loan.count({ where: { returnedAt: null } }),
    prisma.sale.count(),
    prisma.loan.findMany({
      take: 5,
      orderBy: { loanedAt: "desc" },
      include: { book: true, borrower: true },
    }),
    prisma.sale.findMany({
      take: 5,
      orderBy: { soldAt: "desc" },
      include: { book: true },
    }),
    prisma.book.findMany({
      where: { quantityEmprestimo: { gt: 0 } },
      include: { _count: { select: { loans: { where: { returnedAt: null } } } } },
    }),
  ]);

  const availableForLoan = booksForLoan.filter(
    (b) => b.quantityEmprestimo - b._count.loans > 0
  ).length;

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
          <p className="text-sm text-gray-500">Controle de Venda e Empréstimo de Livros</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchModal />
          <BorrowerSearchModal />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total de Livros"
          value={totalBooks}
          icon={BookOpen}
          colorClass="text-gray-600"
        />
        <StatsCard
          label="Disponíveis p/ Empréstimo"
          value={availableForLoan}
          icon={BookMarked}
          colorClass="text-blue-600"
        />
        <StatsCard
          label="Empréstimos Ativos"
          value={activeLoansCount}
          icon={ArrowLeftRight}
          colorClass="text-orange-500"
        />
        <StatsCard
          label="Vendas Realizadas"
          value={totalSalesCount}
          icon={ShoppingCart}
          colorClass="text-green-600"
        />
      </div>

      {/* Green promo card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-medium opacity-80">Sistema ConVEL</p>
          <p className="text-lg font-bold mt-0.5">Controle de acervo simplificado</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/livros/novo"
            className="bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-50 transition-colors"
          >
            + Novo Livro
          </Link>
          <Link
            href="/emprestimos/novo"
            className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
          >
            + Novo Empréstimo
          </Link>
          <Link
            href="/vendas/nova"
            className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
          >
            + Nova Venda
          </Link>
        </div>
      </div>

      {/* Two tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest Loans */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Últimos Empréstimos</h3>
            <Link href="/emprestimos" className="text-xs text-blue-600 hover:underline">
              Ver todos →
            </Link>
          </div>
          {latestLoans.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhum empréstimo ainda</p>
          ) : (
            <div className="space-y-3">
              {latestLoans.map((loan) => {
                const dias = daysSince(loan.loanedAt);
                return (
                  <div key={loan.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{loan.book.title}</p>
                      <p className="text-xs text-gray-500">{loan.borrower.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500">{formatDate(loan.loanedAt)}</p>
                      <span
                        className={`text-xs font-medium ${
                          dias > 30 ? "text-red-500" : "text-gray-400"
                        }`}
                      >
                        {dias}d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Latest Sales */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Últimas Vendas</h3>
            <Link href="/vendas" className="text-xs text-green-600 hover:underline">
              Ver todas →
            </Link>
          </div>
          {latestSales.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhuma venda ainda</p>
          ) : (
            <div className="space-y-3">
              {latestSales.map((sale) => (
                <div key={sale.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{sale.book.title}</p>
                    <p className="text-xs text-gray-500">Qtd: {sale.quantity}</p>
                  </div>
                  <p className="text-xs text-gray-500 shrink-0">{formatDate(sale.soldAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
