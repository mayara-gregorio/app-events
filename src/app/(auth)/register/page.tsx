"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { RegisterForm } from "@/components/register-form/register-form"

export default function RegisterPage() {
  const router = useRouter()

  async function handleRegister(credentials: {
    name: string
    email: string
    password: string
  }) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null

    if (!response.ok) {
      throw new Error(data?.message ?? "Não foi possível criar sua conta.")
    }

    toast.success(data?.message ?? "Conta criada com sucesso!")
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center py-12 gap-4">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  )
}
