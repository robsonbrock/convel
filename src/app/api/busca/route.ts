import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeStr } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const leitor = searchParams.get("leitor")?.trim() ?? "";

  // Borrower search
  if (leitor.length >= 2) {
    const nLeitor = normalizeStr(leitor);
    const allBorrowers = await prisma.borrower.findMany({
      include: {
        loans: {
          where: { returnedAt: null },
          include: { book: true },
        },
      },
    });
    const borrowers = allBorrowers.filter((b) =>
      [b.name, b.cpf].some((f: string) => normalizeStr(f).includes(nLeitor))
    ).slice(0, 10);
    return NextResponse.json({ borrowers });
  }

  // Book search
  if (q.length < 2) {
    return NextResponse.json({ books: [] });
  }

  const nQ = normalizeStr(q);
  const allBooks = await prisma.book.findMany({
    include: {
      _count: { select: { loans: { where: { returnedAt: null } } } },
    },
  });

  const books = allBooks
    .filter((b) => [b.title, b.author].some((f) => normalizeStr(f).includes(nQ)))
    .slice(0, 10);

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
