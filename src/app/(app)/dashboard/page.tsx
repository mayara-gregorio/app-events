"use client"

import { useEffect, useState } from "react"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Event = {
  id: string
  title: string
  date: string
  time: string
  location: string
}

const cards = [
  { title: "Gestão completa", text: "Cadastre, edite e exclua eventos em poucos cliques." },
  { title: "Inscrições seguras", text: "Cada participante gerencia apenas as próprias inscrições." },
];


export default function DashboardPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/events")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message)
        }

        setEvents(data.events)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar eventos.")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (isLoading) {
    return <p>Carregando...</p>
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  const today = new Date().toISOString().slice(0, 10)
  const upcomingEvents = events.filter((event) => event.date.slice(0, 10) >= today)
  const nextEvent = upcomingEvents[0]

  return (
    <div className="space-y-8">
        <div className="flex justify-between">
            <div>
                <h1>Olá, {user?.name}</h1>
                <h2 className="text-[#333]">Acompanhe aqui seus eventos</h2>
            </div>
            <div className="flex gap-2">
                <Link href="/events/create">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    Criar Evento
                </Button>
                </Link>
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    Participar de um Evento
                </Button>
            </div>
        </div>
      

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Total de eventos</p>
          <p className="text-4xl font-bold">{events.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Próximos eventos</p>
          <p className="text-4xl font-bold">{upcomingEvents.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Eventos realizados</p>
          <p className="text-4xl font-bold">{events.length - upcomingEvents.length}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold">Próximo evento</h2>
        {nextEvent ? (
          <p className="mt-2">
            {nextEvent.title} · {new Date(nextEvent.date).toLocaleDateString("pt-BR")} ·{" "}
            {nextEvent.time} · {nextEvent.location}
          </p>
        ) : (
          <p className="mt-2 text-slate-500">Você ainda não tem eventos futuros.</p>
        )}
      </div>
    </div>
  )
}