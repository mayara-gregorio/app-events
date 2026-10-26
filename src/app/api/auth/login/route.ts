import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { z } from "zod"
import { SignJWT } from "jose"
import { prisma } from "@/lib/prisma"


const loginSchema = z.object({
  email: z.email("Digite um e-mail válido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
})



function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET ausente ou com menos de 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}
 
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const parsed = loginSchema.safeParse({ email, password })

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 },
      )
    }

    const normalizedEmail = email.toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: "E-mail ou senha inválidos." },
        { status: 401 },
      )
    }

    const verifyPassword = await bcrypt.compare(password, existingUser.password)

    if (!verifyPassword) {
      return NextResponse.json(
        { message: "E-mail ou senha inválidos." },
        { status: 401 },
      )
    }

    const token = await new SignJWT()
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(existingUser.id)
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(getSecret())

    const response = NextResponse.json({
      message: "Login realizado com sucesso.",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    })

    return response

  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      { message: "Não foi possível realizar login." },
      { status: 500 },
    )
  }
}