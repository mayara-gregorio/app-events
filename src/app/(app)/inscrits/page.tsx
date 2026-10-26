import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Props = {
    params: Promise<{ id: string }>
}

export default async function InscritosPage({ params }: Props) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    const { id } = await params

    const evento = await prisma.event.findUnique({
        where: { id },
        include: {
            registrations: {
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: "asc" },
            },
        },
    })

    if (!evento) {
        notFound()
    }

    if (evento.creatorId !== user.id) {
        return (
            <main className="mx-auto max-w-3xl space-y-4 p-6">
                <p>Você não tem permissão para ver os inscritos deste evento.</p>
                <Button variant="outline">
                    <Link href="/me">Voltar</Link>
                </Button>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-4xl space-y-6 p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Link href="/me" className="text-sm text-muted-foreground hover:underline">
                        ← Voltar para o perfil
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold">{evento.title}</h1>
                    <p className="text-muted-foreground">
                        {new Date(evento.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })} às {evento.time} · {evento.location}
                    </p>
                </div>
                <Badge className="text-base">{evento.registrations.length} inscritos</Badge>
            </div>

            <Card>
                <CardContent className="p-0">
                    {evento.registrations.length === 0 ? (
                        <p className="p-6 text-center text-muted-foreground">
                            Ninguém se inscreveu neste evento ainda.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>E-mail</TableHead>
                                    <TableHead>Inscrito em</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {evento.registrations.map((inscricao, index) => (
                                    <TableRow key={inscricao.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{inscricao.user.name}</TableCell>
                                        <TableCell>{inscricao.user.email}</TableCell>
                                        <TableCell>{new Date(inscricao.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}