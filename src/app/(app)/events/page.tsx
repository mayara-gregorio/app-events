"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { EventCard, type Event } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventDetailsPage() {
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
        setError(
          err instanceof Error ? err.message : "Erro ao carregar eventos.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#10264D]">Meus eventos</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Carregando..."
              : `${events.length} evento(s) cadastrado(s)`}
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/events/create" />}
          className="bg-[#10264D] text-white hover:bg-[#10264D]/90"
        >
          Novo evento
        </Button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}

      {!isLoading && !error && events.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            Você ainda não criou nenhum evento.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/events/create" />}
            variant="outline"
            className="mt-4"
          >
            Criar meu primeiro evento
          </Button>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id}>
                <Link href={`/events/${event.id}`}>
                <EventCard event={event} />
                </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}