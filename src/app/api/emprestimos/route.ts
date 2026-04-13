import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const loanSchema = z.object({
  bookId: z.coerce.number().int(),
  borrowerId: z.coerce.number().int(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const where =
    status === "active" ? { returnedAt: null } : status === "closed" ? { returnedAt: { not: null } } : {};

  const loans = await prisma.loan.findMany({
    where,
    orderBy: { loanedAt: "desc" },
    include: { book: true, borrower: true },
  });
  return NextResponse.json(loans);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, borrowerId, notes } = loanSchema.parse(body);

    // Availability check
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }
    if (book.type !== "EMPRESTIMO") {
      return NextResponse.json({ error: "Este livro não está disponível para empréstimo" }, { status: 400 });
    }
    const activeLoanCount = await prisma.loan.count({
      where: { bookId, returnedAt: null },
    });
    if (activeLoanCount >= book.quantity) {
      return NextResponse.json({ error: "Não há exemplares disponíveis para empréstimo" }, { status: 409 });
    }

    const loan = await prisma.loan.create({
      data: { bookId, borrowerId, notes },
      include: { book: true, borrower: true },
    });
    return NextResponse.json(loan, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
