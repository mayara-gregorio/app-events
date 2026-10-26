import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProfileForm from "@/components/profile-form"

export default async function MePage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    const meusEventos = await prisma.event.findMany({
        where: { creatorId: user.id },
        orderBy: { date: "asc" },
        include: { _count: { select: { registrations: true } } },
    })

    const userCurrent = await prisma.user.findUnique({
        where: { id: user.id },
        select: { name: true, email: true }
    })

    if (!userCurrent) {
        redirect("/login")
    }

    const minhasInscricoes = await prisma.registration.count({
        where: { userId: user.id },
    })

    const iniciais = userCurrent
        .name
        .split(" ")
        .filter((parte) => parte !== "")
        .slice(0, 2)
        .map((parte) => parte[0].toUpperCase())
        .join("")

    return (
        <main className="mx-auto max-w-3xl space-y-6 p-6">
            {/* Topo com os dados do usuário */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-xl font-bold">{iniciais}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{userCurrent.name}</CardTitle>
                        <CardDescription>{userCurrent.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Eventos criados</p>
                        <p className="text-2xl font-bold">{meusEventos.length}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Minhas inscrições</p>
                        <p className="text-2xl font-bold">{minhasInscricoes}</p>
                    </div>
                </CardContent>
            </Card>

            <ProfileForm name={userCurrent.name} email={userCurrent.email} />

            <Card>
                <CardHeader>
                    <CardTitle>Meus eventos</CardTitle>
                    <CardDescription>Eventos que você criou</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {meusEventos.length === 0 && (
                        <p className="text-sm text-muted-foreground">Você ainda não criou nenhum evento.</p>
                    )}

                    {meusEventos.map((evento) => (
                        <div key={evento.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <p className="font-medium">{evento.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(evento.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })} · {evento.location}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary">{evento._count.registrations} inscritos</Badge>
                                <Button  size="sm" variant="outline">
                                    <Link href={`/events/${evento.id}/inscritos`}>Ver inscritos</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </main>
    )
}