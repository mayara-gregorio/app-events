import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/auth"
import { findEvent } from "@/lib/events"
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


type RouteContext = {
    params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
        }

        const { id } = await params
        const event = await findEvent(id)

        if (!event) {
            return NextResponse.json({ message: "Evento não encontrado." }, { status: 404 })
        }

        if (event.creatorId !== user.id) {
            return NextResponse.json({ message: "Sem permissão." }, { status: 403 })
        }

        const registrations = await prisma.registration.findMany({
            where: { eventId: id },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                createdAt: true,
                user: { select: { id: true, name: true, email: true } },
            },
        })

        return NextResponse.json({ participants: registrations })
    } catch (error) {
        console.error("Participants GET error:", error)

        return NextResponse.json(
            { message: "Não foi possível carregar os inscritos." },
            { status: 500 },
        )
    }
}