"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { EventForm } from "@/components/event-form/event-form"

export default function EventsCreatePage() {
  const router = useRouter()

  async function handleCreateEvent(values: {
    title: string
    description: string
    date: string
    time: string
    location: string
    image: string
  }) {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    const data: { message?: string } = await response.json()

    if (!response.ok) {
      throw new Error(data.message ?? "Não foi possível criar o evento.")
    }

    toast.success(data.message ?? "Evento criado com sucesso!")
    router.push("/events")
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-12">
      <EventForm onSubmit={handleCreateEvent} />
    </div>
  )
}
