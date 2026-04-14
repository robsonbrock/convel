import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const leitor = searchParams.get("leitor")?.trim() ?? "";

  // Borrower search
  if (leitor.length >= 2) {
    const borrowers = await prisma.borrower.findMany({
      where: {
        OR: [
          { name: { contains: leitor } },
          { cpf: { contains: leitor } },
        ],
      },
      include: {
        loans: {
          where: { returnedAt: null },
          include: { book: true },
        },
      },
      take: 10,
    });
    return NextResponse.json({ borrowers });
  }

  // Book search
  if (q.length < 2) {
    return NextResponse.json({ books: [] });
  }

  const books = await prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { author: { contains: q } },
      ],
    },
    include: {
      _count: { select: { loans: { where: { returnedAt: null } } } },
    },
    take: 10,
  });

  return NextResponse.json({
    books: books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      quantityEmprestimo: b.quantityEmprestimo,
      quantityVenda: b.quantityVenda,
      availableCopies: b.quantityEmprestimo - b._count.loans,
      activeLoansCount: b._count.loans,
    })),
  });
}
