import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Detalhes da inscrição ainda não implementados." }, { status: 501 })
}

export async function DELETE() {
  return NextResponse.json({ message: "Exclusão da inscrição ainda não implementada." }, { status: 501 })
}
