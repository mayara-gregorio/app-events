import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image: string
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  })
}

export function EventCard({ event }: { event: Event }) {
  const today = new Date().toISOString().slice(0, 10)
  const isUpcoming = event.date.slice(0, 10) >= today

  return (
    <Card className="overflow-hidden pt-0">
      <img
        src={event.image}
        alt={event.title}
        className="h-48 w-full object-cover"
      />

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{event.title}</CardTitle>
          <Badge variant={isUpcoming ? "default" : "secondary"}>
            {isUpcoming ? "Próximo" : "Realizado"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-col items-start gap-1 text-sm text-muted-foreground">
        <p>
          {formatDate(event.date)} · {event.time}
        </p>
        <p>{event.location}</p>
      </CardFooter>
    </Card>
  )
}