import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
        return NextResponse.json({ message: "Não autenticado." }, { status: 401 })
    }

    return NextResponse.json({ user: { id: "...", name: "...", email: "..." } })
}