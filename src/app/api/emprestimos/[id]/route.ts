import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const renewSchema = z.object({ action: z.literal("renew") });

function formatDateBR(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await req.json();
    const { action } = renewSchema.parse(body);

    if (action === "renew") {
      const existing = await prisma.loan.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: "Empréstimo não encontrado" }, { status: 404 });
      if (existing.returnedAt) return NextResponse.json({ error: "Empréstimo já encerrado" }, { status: 400 });

      const renovacaoNote = `Renovado em ${formatDateBR(new Date())}`;
      const newNotes = existing.notes
        ? `${existing.notes}\n${renovacaoNote}`
        : renovacaoNote;

      const loan = await prisma.loan.update({
        where: { id },
        data: { notes: newNotes },
        include: { book: true, borrower: true },
      });
      return NextResponse.json(loan);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
