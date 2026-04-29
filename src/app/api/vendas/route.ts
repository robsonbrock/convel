import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_SESSION } from "@/lib/auth";
import { z } from "zod";

const TIPOS_PAGAMENTO = ["dinheiro", "pix", "credito", "debito", "outros"] as const;

const saleSchema = z.object({
  bookId: z.coerce.number().int(),
  quantity: z.coerce.number().int().min(1),
  priceEach: z.coerce.number().min(0).optional().nullable(),
  tipoPagamento: z.enum(TIPOS_PAGAMENTO).optional().nullable(),
  notes: z.string().max(500).optional(),
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
    const { bookId, quantity, priceEach, tipoPagamento, notes } = saleSchema.parse(body);
    const operador = MOCK_SESSION.fullName;

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
    }
    if (book.quantityVenda <= 0) {
      return NextResponse.json({ error: "Este livro não está disponível para venda" }, { status: 400 });
    }
    if (quantity > book.quantityVenda) {
      return NextResponse.json(
        { error: `Quantidade solicitada (${quantity}) maior que o estoque disponível (${book.quantityVenda})` },
        { status: 409 }
      );
    }

    const [sale] = await prisma.$transaction([
      prisma.sale.create({
        data: { bookId, quantity, priceEach: priceEach ?? null, tipoPagamento: tipoPagamento ?? null, notes, operador },
        include: { book: true },
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { quantityVenda: { decrement: quantity } },
      }),
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
