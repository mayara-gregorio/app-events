import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Eventos ainda não implementados." }, { status: 501 })
}

export async function POST() {
  return NextResponse.json({ message: "Criação de eventos ainda não implementada." }, { status: 501 })
}
