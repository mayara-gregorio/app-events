import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"

import { PrismaClient } from "@/generated/prisma/client"

const registerSchema = z.object({
  name: z.string().trim().min(2, "Digite seu nome completo."),
  email: z.email("Digite um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
})

//isso declara uma instância global do prisma para não criar várias conexões
const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient
}

const connectionString = process.env.DATABASE_URL

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  })
  
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      )
    }

    const { name, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Este e-mail já está cadastrado." },
        { status: 409 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        message: "Usuário cadastrado com sucesso.",
        user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Register error:", error)

    return NextResponse.json(
      { message: "Não foi possível concluir o cadastro." },
      { status: 500 },
    )
  }
}
