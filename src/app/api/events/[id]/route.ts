import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Detalhes do evento ainda não implementados." }, { status: 501 })
}

export async function PUT() {
  return NextResponse.json({ message: "Atualização do evento ainda não implementada." }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ message: "Exclusão do evento ainda não implementada." }, { status: 501 })
}
