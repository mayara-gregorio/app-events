import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient
}

const connectionString = process.env.DATABASE_URL

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
    })

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