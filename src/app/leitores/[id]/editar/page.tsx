import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditarLeitorForm from "./EditarLeitorForm";

export default async function EditarLeitorPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const borrower = await prisma.borrower.findUnique({ where: { id } });
  if (!borrower) notFound();

  return <EditarLeitorForm borrower={borrower} />;
}
