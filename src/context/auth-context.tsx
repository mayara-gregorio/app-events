"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"

type User = {
    id: string
    name: string
    email: string
}

type Credentials = {
    email: string
    password: string
}

type AuthContextType = {
    user: User | null
    isLoading: boolean
    login: (credentials: Credentials) => Promise<string>
    logout: () => Promise<string>
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType,)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch("/api/auth/me")

                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch {
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        loadUser()
    }, [])

    async function login(credentials: Credentials) {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        })

        const data = await response.json()

        if (!response.ok || !data?.user) {
            throw new Error(data?.message ?? "Não foi possível realizar login.")
        }

        setUser(data.user)
        return data.message ?? "Login realizado com sucesso!"
    }

    async function logout() {
        const response = await fetch("/api/auth/logout", { method: "POST" })
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data?.message ?? "Não foi possível realizar logout.")
        }

        setUser(null)
        return data?.message ?? "Logout realizado com sucesso!"
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}