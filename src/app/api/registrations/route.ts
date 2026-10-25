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
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
        }

        const registrations = await prisma.registration.findMany({
            where: { userId: user.id },
            orderBy: { event: { date: "asc" } },
            include: {
                event: {
                    include: {
                        creator: { select: { name: true } },
                        _count: { select: { registrations: true } },
                    },
                },
            },
        })

        const events = registrations.map(({ createdAt, event }) => ({
            ...event,
            registeredAt: createdAt,
        }))

        return NextResponse.json({ events })
    } catch (error) {
        console.error("Registrations GET error:", error)

        return NextResponse.json(
            { message: "Não foi possível carregar suas inscrições." },
            { status: 500 },
        )
    }
}