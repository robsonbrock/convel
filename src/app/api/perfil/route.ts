import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_SESSION } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

const profileSchema = z.object({
  fullName: z.string().min(3),
  newPassword: z.string().min(6).optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const data = profileSchema.parse(body);

    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      return NextResponse.json({ error: "As senhas não coincidem" }, { status: 400 });
    }

    const updateData: { fullName: string; passwordHash?: string } = {
      fullName: data.fullName,
    };

    if (data.newPassword && data.newPassword.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(data.newPassword, 10);
    }

    const user = await prisma.adminUser.update({
      where: { id: MOCK_SESSION.id },
      data: updateData,
      select: { id: true, fullName: true, email: true, isSuperAdmin: true },
    });

    return NextResponse.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
