"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/dashboard")
        }
    }, [user, isLoading, router])

    if (isLoading || user) {
        return null
    }

    return <>{children}</>
}