import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import EventDetailsPage from "./event-details"

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-96 rounded-xl" />
        </div>
      }
    >
      <EventDetailsPage />
    </Suspense>
  )
}
