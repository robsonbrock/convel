import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
  return NextResponse.json(book);
}

const schema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  publisher: z.string().min(2),
  year: z.coerce.number().int().min(1800).max(new Date().getFullYear()),
  isbn: z.string().optional().nullable(),
  quantityEmprestimo: z.coerce.number().int().min(0),
  quantityVenda: z.coerce.number().int().min(0),
  priceVenda: z.coerce.number().min(0).optional().nullable(),
}).refine((d) => d.quantityEmprestimo + d.quantityVenda > 0, {
  message: "Informe pelo menos 1 exemplar (empréstimo ou venda)",
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
  }

  const { isbn, ...rest } = parsed.data;

  try {
    const book = await prisma.book.update({
      where: { id },
      data: { ...rest, isbn: isbn || null },
    });
    return NextResponse.json(book);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Unique constraint") && msg.includes("isbn")) {
      return NextResponse.json({ error: "ISBN já cadastrado para outro livro" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro ao atualizar livro" }, { status: 500 });
  }
}
