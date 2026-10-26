import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
    try {

        const events = await prisma.event.findMany({
            orderBy: { date: "asc" },
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