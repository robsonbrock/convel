import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const adminSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
});

export async function GET() {
  const users = await prisma.adminUser.findMany({
    orderBy: { fullName: "asc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      isSuperAdmin: true,
      mustChangePass: true,
      createdAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = adminSchema.parse(body);
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.adminUser.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash,
        mustChangePass: true,
        isSuperAdmin: false,
      },
      select: { id: true, fullName: true, email: true, createdAt: true },
    });

    // Return temp password so it can be shown on screen (email stubbed)
    return NextResponse.json({ ...user, tempPassword }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
