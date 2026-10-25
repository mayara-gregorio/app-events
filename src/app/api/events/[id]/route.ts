import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"
import { findEvent } from "@/lib/events"


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

        if (!(await findEvent(id))) {
            return NextResponse.json({ message: "Evento não encontrado." }, { status: 404 })
        }

        const event = await prisma.event.findUniqueOrThrow({
            where: { id },
            include: {
                creator: { select: { name: true } },
                _count: { select: { registrations: true } },
                registrations: { where: { userId: user.id }, select: { id: true } },
            },
        })

        const { registrations, _count, ...data } = event

        return NextResponse.json({
            event: {
                ...data,
                registrationsCount: _count.registrations,
                isOwner: event.creatorId === user.id,
                isRegistered: registrations.length > 0,
            },
        })
    } catch (error) {
        console.error("Event GET error:", error)

        return NextResponse.json(
            { message: "Não foi possível carregar o evento." },
            { status: 500 },
        )
    }
}

export async function PUT(request: Request, { params }: RouteContext) {
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

        const body = await request.json()
        const { title, description, date, time, location, image } = body

        if (!title || !description || !date || !time || !location || !image) {
            return NextResponse.json(
                { message: "Preencha todos os campos." },
                { status: 400 },
            )
        }

        const eventDate = new Date(date)

        if (isNaN(eventDate.getTime())) {
            return NextResponse.json({ message: "Data inválida." }, { status: 400 })
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                date: eventDate,
                time,
                location,
                image,
            },
        })

        return NextResponse.json({
            message: "Evento atualizado com sucesso!",
            event: updatedEvent,
        })
    } catch (error) {
        console.error("Event PUT error:", error)

        return NextResponse.json(
            { message: "Não foi possível atualizar o evento." },
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
        const event = await findEvent(id)

        if (!event) {
            return NextResponse.json({ message: "Evento não encontrado." }, { status: 404 })
        }

        if (event.creatorId !== user.id) {
            return NextResponse.json({ message: "Sem permissão." }, { status: 403 })
        }

        await prisma.event.delete({ where: { id } })

        return NextResponse.json({ message: "Evento excluído com sucesso!" })
    } catch (error) {
        console.error("Event DELETE error:", error)

        return NextResponse.json(
            { message: "Não foi possível excluir o evento." },
            { status: 500 },
        )
    }
}