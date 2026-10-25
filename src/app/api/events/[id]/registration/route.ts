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

export async function POST(_request: Request, { params }: RouteContext) {
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

        if (event.creatorId === user.id) {
            return NextResponse.json(
                { message: "Você é o organizador deste evento." },
                { status: 400 },
            )
        }

        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        if (event.date < today) {
            return NextResponse.json({ message: "Este evento já aconteceu." }, { status: 400 })
        }

        try {
            await prisma.registration.create({
                data: { userId: user.id, eventId: id },
            })
        } catch (error) {
            // P2002 = violação do @@unique([userId, eventId])
            if ((error as { code?: string }).code === "P2002") {
                return NextResponse.json({ message: "Você já está inscrito." }, { status: 409 })
            }

            throw error
        }

        return NextResponse.json({ message: "Inscrição realizada!" }, { status: 201 })
    } catch (error) {
        console.error("Registration POST error:", error)

        return NextResponse.json(
            { message: "Não foi possível realizar a inscrição." },
            { status: 500 },
        )
    }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
        }

        const { id } = await params

        if (!(await findEvent(id))) {
            return NextResponse.json({ message: "Evento não encontrado." }, { status: 404 })
        }

        await prisma.registration.deleteMany({
            where: { userId: user.id, eventId: id },
        })

        return NextResponse.json({ message: "Inscrição cancelada." })
    } catch (error) {
        console.error("Registration DELETE error:", error)

        return NextResponse.json(
            { message: "Não foi possível cancelar a inscrição." },
            { status: 500 },
        )
    }
}