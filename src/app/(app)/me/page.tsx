import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
        </main>
    )
}