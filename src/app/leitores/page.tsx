import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Plus, Pencil } from "lucide-react";
import { formatCPF, formatDate, normalizeStr } from "@/lib/utils";
import SortableHeader from "@/components/ui/SortableHeader";
import LeitoresFilterBar from "@/components/leitores/LeitoresFilterBar";

type SortField = "name" | "cpf" | "phone" | "createdAt";
type SortOrder = "asc" | "desc";

export default async function LeitoresPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string; leitor?: string };
}) {
  const sort = (searchParams.sort as SortField) || "name";
  const order: SortOrder = searchParams.order === "desc" ? "desc" : "asc";
  const leitor = searchParams.leitor?.trim() ?? "";

  const validSorts: SortField[] = ["name", "cpf", "phone", "createdAt"];
  const safeSort: SortField = validSorts.includes(sort) ? sort : "name";

  const allBorrowers = await prisma.borrower.findMany({
    orderBy: { [safeSort]: order },
    include: { _count: { select: { loans: { where: { returnedAt: null } } } } },
  });

  const nLeitor = normalizeStr(leitor);
  const borrowers = nLeitor
    ? allBorrowers.filter((b: (typeof allBorrowers)[number]) =>
        [b.name, b.cpf, b.email ?? ""].some((f) => normalizeStr(f).includes(nLeitor))
      )
    : allBorrowers;

  const sh = (column: SortField, label: string, className?: string) => (
    <SortableHeader
      column={column}
      label={label}
      basePath="/leitores"
      currentSort={safeSort}
      currentOrder={order}
      className={className}
    />
  );

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

      <LeitoresFilterBar initialLeitor={leitor} currentSort={safeSort} currentOrder={order} />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {borrowers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">
              {leitor ? "Nenhum leitor encontrado para esse filtro" : "Nenhum leitor cadastrado ainda"}
            </p>
            {!leitor && (
              <Link href="/leitores/novo" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                Cadastrar primeiro leitor
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {sh("name", "Nome")}
                {sh("cpf", "CPF", "hidden md:table-cell")}
                {sh("phone", "Telefone", "hidden lg:table-cell")}
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Empréstimos ativos</th>
                {sh("createdAt", "Cadastrado em", "hidden lg:table-cell")}
                <th className="px-3 py-3 text-center text-gray-500 font-medium text-xs">Editar</th>
              </tr>
            </thead>
            <tbody>
              {borrowers.map((b: (typeof borrowers)[number]) => (
                <tr key={b.id} className="border-b border-gray-70 hover:bg-blue-50">
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
                  <td className="px-3 py-3 text-center">
                    <Link
                      href={`/leitores/${b.id}/editar`}
                      title="Editar"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
