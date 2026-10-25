"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"

export function AppAuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return null
  }

  return children
}
