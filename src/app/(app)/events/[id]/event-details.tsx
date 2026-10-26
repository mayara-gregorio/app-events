"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"

import { formatDate, type Event } from "@/components/event-card"
import { useAuth } from "@/hooks/use-auth"
import {
  EventForm,
  type EventFormValues,
} from "@/components/event-form/event-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

type EventDetails = Event & {
  creator: { name: string }
  registrationsCount: number
  isOwner: boolean
  isRegistered: boolean
}

export default function EventDetailsPage({ id, inscritos }: { id: string; inscritos: ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()

  const [event, setEvent] = useState<EventDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await fetch(`/api/events/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message)
        }

        setEvent(data.event)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar evento.")
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [id])

  async function handleUpdate(values: EventFormValues) {
    const response = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message ?? "Não foi possível atualizar o evento.")
    }

    setEvent({ ...event!, ...data.event })
    setIsEditOpen(false)
    toast.success(data.message ?? "Evento atualizado com sucesso!")
  }

  async function handleRegistration() {
    if (!event) return

    setIsRegistering(true)

    try {
        const response = await fetch(`/api/events/${id}/registration`, {
        method: event.isRegistered ? "DELETE" : "POST",
        })
        const data = await response.json()

        if (!response.ok) {
        throw new Error(data.message)
        }

        setEvent({
        ...event,
        isRegistered: !event.isRegistered,
        registrationsCount: event.registrationsCount + (event.isRegistered ? -1 : 1),
        })
        toast.success(data.message)
    } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo deu errado.")
    } finally {
        setIsRegistering(false)
    }
}
  async function handleDelete() {
    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      toast.success(data.message ?? "Evento excluído com sucesso!")
      router.push("/events")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível excluir o evento.",
      )
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Evento não encontrado."}
        </p>
        <Link href="/explore" className={buttonVariants({ variant: "outline" })}>
          Voltar para os eventos
        </Link>
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  const isUpcoming = event.date.slice(0, 10) >= today

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/explore" className={buttonVariants({ variant: "ghost" })}>
        ← Voltar
      </Link>

      <Card className="overflow-hidden pt-0">
        <img
          src={event.image}
          alt={event.title}
          className="h-64 w-full object-cover"
        />

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <Badge variant={isUpcoming ? "default" : "secondary"}>
              {isUpcoming ? "Próximo" : "Realizado"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="whitespace-pre-line text-slate-700">
            {event.description}
          </p>

          <div className="grid gap-4 text-sm sm:grid-cols-5">
            <div>
              <p className="text-muted-foreground">Data</p>
              <p className="font-medium">{formatDate(event.date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Horário</p>
              <p className="font-medium">{event.time}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Local</p>
              <p className="font-medium">{event.location}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Organizador</p>
                <p className="font-medium">{event.creator.name}</p>
            </div>
            <div>
                
                <p className="text-muted-foreground">Inscritos</p>
                <p className="font-medium">{event.registrationsCount}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-2">
            {event.isOwner ? (
                <>
                <Button
                    className="bg-[#10264D] text-white hover:bg-[#10264D]/90"
                    onClick={() => setIsEditOpen(true)}
                >
                    Editar
                </Button>
                <Button variant="outline" onClick={() => setIsDeleteOpen(true)}>
                    Excluir
                </Button>
                </>
            ) : !user ? (
                <Button
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className="bg-[#10264D] text-white hover:bg-[#10264D]/90"
                >
                  Entre para se inscrever
                </Button>
            ) : !isUpcoming ? (
                <Button disabled>Evento encerrado</Button>
            ) : (
                <Button
                variant={event.isRegistered ? "outline" : "default"}
                className={
                    event.isRegistered ? "" : "bg-[#10264D] text-white hover:bg-[#10264D]/90"
                }
                disabled={isRegistering}
                onClick={handleRegistration}
                >
                {event.isRegistered ? "Cancelar inscrição" : "Inscrever-se"}
                </Button>
            )}
        </CardFooter>
      </Card>

      {/* tabela de inscritos fica fora do card, só para o dono do evento */}
      {event.isOwner && inscritos}
    {event.isOwner && (
        <>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar evento</DialogTitle>
                    <DialogDescription>
                    Altere os dados abaixo e salve para atualizar o evento.
                    </DialogDescription>
                </DialogHeader>

                <EventForm
                    submitLabel="Salvar alterações"
                    onSubmit={handleUpdate}
                    defaultValues={{
                    title: event.title,
                    description: event.description,
                    date: event.date.slice(0, 10),
                    time: event.time,
                    location: event.location,
                    image: event.image,
                    }}
                />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir este evento?</AlertDialogTitle>
                    <AlertDialogDescription>
                    Essa ação não pode ser desfeita. O evento e todas as inscrições
                    dele serão apagados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={handleDelete}
                    >
                    Sim, excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )}
    </div>
  )
}