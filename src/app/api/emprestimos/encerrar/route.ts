import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ loanId: z.coerce.number().int() });

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { loanId } = schema.parse(body);

    const existing = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!existing) {
      return NextResponse.json({ error: "Empréstimo não encontrado" }, { status: 404 });
    }
    if (existing.returnedAt) {
      return NextResponse.json({ error: "Empréstimo já encerrado" }, { status: 400 });
    }

    const loan = await prisma.loan.update({
      where: { id: loanId },
      data: { returnedAt: new Date() },
      include: { book: true, borrower: true },
    });
    return NextResponse.json(loan);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
