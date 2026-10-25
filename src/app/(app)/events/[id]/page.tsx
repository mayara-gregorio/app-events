import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import EventDetailsPage from "./event-details"

type Props = { params: Promise<{ id: string }> }

async function EventContent({ params }: Props) {
  const { id } = await params
  return <EventDetailsPage id={id} />
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
