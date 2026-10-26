import { prisma } from "@/lib/prisma"

export async function findEvent(id: string) {
    return prisma.event.findUnique({ where: { id } })
}