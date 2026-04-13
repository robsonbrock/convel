import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  publisher: z.string().min(2),
  year: z.coerce.number().int().min(1800).max(new Date().getFullYear()),
  isbn: z.string().optional(),
  quantity: z.coerce.number().int().min(1),
  type: z.enum(["VENDA", "EMPRESTIMO"]),
});

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { loans: { where: { returnedAt: null } } },
      },
    },
  });

  return NextResponse.json(
    books.map((b) => ({
      ...b,
      activeLoanCount: b._count.loans,
      availableCopies: b.type === "EMPRESTIMO" ? b.quantity - b._count.loans : b.quantity,
    }))
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookSchema.parse(body);
    const book = await prisma.book.create({
      data: {
        ...data,
        isbn: data.isbn && data.isbn.trim() !== "" ? data.isbn.trim() : null,
      },
    });
    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
