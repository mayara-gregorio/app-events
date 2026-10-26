import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"


export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
        }

        const events = await prisma.event.findMany({
            where: { creatorId: user.id },
            orderBy: { date: "asc" },
            include: {
                _count: { select: { registrations: true } },
            },
        })

        return NextResponse.json({ events })
    } catch (error) {
        console.error("Events GET error:", error)

        return NextResponse.json(
            { message: "Não foi possível carregar os eventos." },
            { status: 500 },
        )
    }
}

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
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

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: eventDate,
                time,
                location,
                image,
                creatorId: user.id,
            },
        })

        return NextResponse.json(
            { message: "Evento criado com sucesso!", event },
            { status: 201 },
        )
    } catch (error) {
        console.error("Events POST error:", error)

        return NextResponse.json(
            { message: "Não foi possível criar o evento." },
            { status: 500 },
        )
    }
}