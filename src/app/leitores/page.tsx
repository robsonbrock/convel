import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { formatCPF, formatDate } from "@/lib/utils";

export default async function LeitoresPage() {
  const borrowers = await prisma.borrower.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { loans: { where: { returnedAt: null } } } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leitores</h2>
          <p className="text-sm text-gray-500">{borrowers.length} leitor(es) cadastrado(s)</p>
        </div>
        <Link
          href="/leitores/novo"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Leitor
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {borrowers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum leitor cadastrado ainda</p>
            <Link href="/leitores/novo" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
              Cadastrar primeiro leitor
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Nome</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden md:table-cell">CPF</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Telefone</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Empréstimos ativos</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium hidden lg:table-cell">Cadastrado em</th>
              </tr>
            </thead>
            <tbody>
              {borrowers.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{b.name}</p>
                    {b.email && <p className="text-xs text-gray-400">{b.email}</p>}
                  </td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{formatCPF(b.cpf)}</td>
                  <td className="px-5 py-3 text-gray-600 hidden lg:table-cell">{b.phone}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        b._count.loans > 0
                          ? "bg-orange-50 text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {b._count.loans}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{formatDate(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
