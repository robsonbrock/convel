import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const updateSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  resetPassword: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    let extra: { passwordHash?: string; mustChangePass?: boolean; tempPassword?: string } = {};
    if (data.resetPassword) {
      const tempPassword = crypto.randomBytes(6).toString("hex");
      extra = {
        passwordHash: await bcrypt.hash(tempPassword, 10),
        mustChangePass: true,
        tempPassword,
      };
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        ...(extra.passwordHash ? { passwordHash: extra.passwordHash, mustChangePass: true } : {}),
      },
      select: { id: true, fullName: true, email: true },
    });

    return NextResponse.json({ ...user, tempPassword: extra.tempPassword ?? null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
