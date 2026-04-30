import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, Plus, Crown, Pencil } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MOCK_SESSION } from "@/lib/auth";
import { redirect } from "next/navigation";
import SortableHeader from "@/components/ui/SortableHeader";

type SortField = "fullName" | "email" | "isSuperAdmin" | "createdAt";
type SortOrder = "asc" | "desc";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: { sort?: string; order?: string };
}) {
  if (!MOCK_SESSION.isSuperAdmin) redirect("/dashboard");

  const sort = (searchParams.sort as SortField) || "fullName";
  const order: SortOrder = searchParams.order === "desc" ? "desc" : "asc";

  const validSorts: SortField[] = ["fullName", "email", "isSuperAdmin", "createdAt"];
  const safeSort: SortField = validSorts.includes(sort) ? sort : "fullName";

  const users = await prisma.adminUser.findMany({
    orderBy: { [safeSort]: order },
    select: {
      id: true,
      fullName: true,
      email: true,
      isSuperAdmin: true,
      mustChangePass: true,
      createdAt: true,
    },
  });

  const sh = (column: SortField, label: string, className?: string) => (
    <SortableHeader
      column={column}
      label={label}
      basePath="/usuarios"
      currentSort={safeSort}
      currentOrder={order}
      className={className}
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Usuários Admin</h2>
          <p className="text-sm text-gray-500">{users.length} usuário(s) cadastrado(s)</p>
        </div>
        <Link
          href="/usuarios/novo"
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Admin
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">Nenhum usuário cadastrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {sh("fullName", "Nome")}
                {sh("email", "E-mail")}
                {sh("isSuperAdmin", "Perfil", "hidden md:table-cell")}
                {sh("createdAt", "Cadastrado em", "hidden lg:table-cell")}
                <th className="px-3 py-3 text-center text-gray-500 font-medium text-xs">Editar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: (typeof users)[number]) => (
                <tr key={u.id} className="border-b border-gray-70 hover:bg-blue-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                        {u.fullName.charAt(0)}
                      </div>
                      <p className="font-medium text-gray-800">{u.fullName}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{u.email}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    {u.isSuperAdmin ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                        <Crown className="w-3 h-3" />
                        Super Admin
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{formatDate(u.createdAt)}</td>
                  <td className="px-3 py-3 text-center">
                    <Link
                      href={`/usuarios/${u.id}/editar`}
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
