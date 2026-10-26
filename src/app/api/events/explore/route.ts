import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search")
        const page = Number(searchParams.get("page")) || 1

        const porPagina = 20
        const hoje = new Date()
        hoje.setUTCHours(0, 0, 0, 0)

        const events = await prisma.event.findMany({
            where: {
                date: { gte: hoje },
                ...(search && {
                    OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { location: { contains: search, mode: "insensitive" } },
                    ],
                }),
            },
            orderBy: { date: "asc" },
            include: { creator: { select: { name: true } } },
            take: porPagina,
            skip: (page - 1) * porPagina,
        })

        const hasMore = events.length === porPagina

        return NextResponse.json({ events, hasMore })
    } catch (error) {
        console.error("Events explore error:", error)

        return NextResponse.json(
            { message: "Não foi possível carregar os eventos." },
            { status: 500 },
        )
    }
}