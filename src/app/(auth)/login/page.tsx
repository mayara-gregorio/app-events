"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { LoginForm } from "@/components/login-form/login-form"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()

    async function handleLogin(credentials: {
        email: string
        password: string
    }) {
        const message = await login(credentials)
        toast.success(message)
        router.push("/explore")
    }

    return (
        <div className="flex min-h-screen flex-col items-center py-12 gap-4">
            <LoginForm onSubmit={handleLogin} />
        </div>
    )
}