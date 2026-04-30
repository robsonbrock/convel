import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateCPF } from "@/lib/utils";

const borrowerSchema = z.object({
  name: z.string().min(3),
  cpf: z.string().refine((v) => validateCPF(v), { message: "CPF inválido" }),
  address: z.string().min(5),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
});

export async function GET() {
  const borrowers = await prisma.borrower.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { loans: { where: { returnedAt: null } } } } },
  });
  return NextResponse.json(
    borrowers.map((b: (typeof borrowers)[number]) => ({ ...b, activeLoans: b._count.loans }))
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = borrowerSchema.parse(body);
    const cpf = data.cpf.replace(/\D/g, "");
    const borrower = await prisma.borrower.create({
      data: {
        ...data,
        cpf,
        email: data.email && data.email.trim() !== "" ? data.email.trim() : null,
      },
    });
    return NextResponse.json(borrower, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
