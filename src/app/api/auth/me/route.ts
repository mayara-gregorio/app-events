import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"


export async function GET() {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { id: true, name: true, email: true },
    })

    if (!user) {
        return NextResponse.json({ message: "Usuário não encontrado." }, { status: 401 })
    }

    return NextResponse.json({ user })
}


export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
        }

        const body = await request.json()
        const { name, email, currentPassword, newPassword } = body

        if (!name || !email) {
            return NextResponse.json({ message: "Preencha nome e e-mail." }, { status: 400 })
        }

        const emailEmUso = await prisma.user.findFirst({
            where: { email, NOT: { id: user.id } },
        })

        if (emailEmUso) {
            return NextResponse.json({ message: "Este e-mail já está em uso." }, { status: 409 })
        }

        const dados: any = { name, email }

        if (newPassword) {
            const usuarioDoBanco = await prisma.user.findUnique({ where: { id: user.id } })

            const senhaCerta = await bcrypt.compare(currentPassword || "", usuarioDoBanco!.password)

            if (!senhaCerta) {
                return NextResponse.json({ message: "Senha atual incorreta." }, { status: 400 })
            }

            dados.password = await bcrypt.hash(newPassword, 10)
        }

        const atualizado = await prisma.user.update({
            where: { id: user.id },
            data: dados,
            select: { id: true, name: true, email: true },
        })

        return NextResponse.json({ user: atualizado })
    } catch (error) {
        console.error("Profile PUT error:", error)

        return NextResponse.json(
            { message: "Não foi possível atualizar o perfil." },
            { status: 500 },
        )
    }
}