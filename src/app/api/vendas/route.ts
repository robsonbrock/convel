import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saleSchema = z.object({
  bookId: z.coerce.number().int(),
  quantity: z.coerce.number().int().min(1),
  notes: z.string().optional(),
});

export async function GET() {
  const sales = await prisma.sale.findMany({
    orderBy: { soldAt: "desc" },
    include: { book: true },
  });
  return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, quantity, notes } = saleSchema.parse(body);

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }
    if (book.type !== "VENDA") {
      return NextResponse.json({ error: "Este livro não está disponível para venda" }, { status: 400 });
    }
    if (quantity > book.quantity) {
      return NextResponse.json({ error: "Quantidade solicitada maior que o estoque disponível" }, { status: 409 });
    }

    const [sale] = await prisma.$transaction([
      prisma.sale.create({ data: { bookId, quantity, notes }, include: { book: true } }),
      prisma.book.update({ where: { id: bookId }, data: { quantity: { decrement: quantity } } }),
    ]);
    return NextResponse.json(sale, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
