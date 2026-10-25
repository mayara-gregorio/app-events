"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { EventCard, type Event } from "@/components/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

type EventsExplorerProps = {
  title?: string
  description?: string
  limit?: number
  seeAllHref?: string
}

export function EventsExplorer({
  title = "Explorar eventos",
  description = "Encontre um evento e faça a sua inscrição.",
  limit,
  seeAllHref,
}: EventsExplorerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isCurrent = true

    // Espera o usuário parar de digitar antes de buscar (debounce)
    const timeout = setTimeout(
      async () => {
        setIsLoading(true)
        setError("")

        try {
          const params = new URLSearchParams()

          if (search.trim()) params.set("q", search.trim())
          if (limit) params.set("limit", String(limit))

          const response = await fetch(`/api/events/explore?${params}`)
          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.message)
          }

          if (isCurrent) {
            setEvents(data.events)
          }
        } catch (err) {
          if (isCurrent) {
            setError(
              err instanceof Error ? err.message : "Erro ao carregar eventos.",
            )
          }
        } finally {
          if (isCurrent) {
            setIsLoading(false)
          }
        }
      },
      search ? 400 : 0,
    )

    return () => {
      isCurrent = false
      clearTimeout(timeout)
    }
  }, [search, limit])

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#10264D]">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {seeAllHref && (
            <Button
              nativeButton={false}
              render={<Link href={seeAllHref} />}
              variant="outline"
            >
              Ver todos
            </Button>
          )}
        </div>

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título ou local"
          className="max-w-md"
        />
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
            {search
              ? `Nenhum evento encontrado para “${search}”.`
              : "Ainda não há eventos disponíveis."}
          </p>

          {search && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearch("")}
            >
              Limpar busca
            </Button>
          )}
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}