import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export async function Inscritos({ eventId }: { eventId: string }) {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/login")
    }

    const evento = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            registrations: {
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: "asc" },
            },
        },
    })

    if (!evento || evento.creatorId !== user.id) {
        return null
    }

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Inscritos</h2>
                <Badge>{evento.registrations.length} inscritos</Badge>
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
        </section>
    )
}
