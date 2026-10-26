import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { Inscritos } from "@/components/inscrits"

import EventDetailsPage from "./event-details"

export const instant = false

type Props = { params: Promise<{ id: string }> }

async function EventContent({ params }: Props) {
  const { id } = await params

  return <EventDetailsPage id={id} inscritos={<Inscritos eventId={id} />} />
}

export default function Page({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      }
    >
      <EventContent params={params} />
    </Suspense>
  )
}
