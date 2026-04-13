import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ books: [] });
  }

  // SQLite LIKE is case-insensitive for ASCII by default
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
      type: b.type,
      quantity: b.quantity,
      availableCopies: b.type === "EMPRESTIMO" ? b.quantity - b._count.loans : b.quantity,
    })),
  });
}
