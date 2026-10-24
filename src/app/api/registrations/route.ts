import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Inscrições ainda não implementadas." }, { status: 501 })
}

export async function POST() {
  return NextResponse.json({ message: "Criação de inscrição ainda não implementada." }, { status: 501 })
}
