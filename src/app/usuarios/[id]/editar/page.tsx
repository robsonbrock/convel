import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditarUsuarioForm from "./EditarUsuarioForm";

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, fullName: true, email: true, isSuperAdmin: true },
  });
  if (!user) notFound();

  return <EditarUsuarioForm user={user} />;
}
