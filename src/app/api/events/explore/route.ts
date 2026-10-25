import { NextResponse } from "next/server"

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


export async function GET(request: Request) {
    try {
        const params = new URL(request.url).searchParams
        const query = params.get("q")?.trim()
        const limit = Number(params.get("limit"))

        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        const events = await prisma.event.findMany({
            where: {
                date: { gte: today },
                ...(query && {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { location: { contains: query, mode: "insensitive" } },
                    ],
                }),
            },
            orderBy: { date: "asc" },
            take: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 5) : undefined,
            include: {
                creator: { select: { name: true } },
                _count: { select: { registrations: true } },
            },
        })

        return NextResponse.json({ events })
    } catch (error) {
        console.error("Events explore error:", error)

        return NextResponse.json(
            { message: "Não foi possível carregar os eventos." },
            { status: 500 },
        )
    }
}