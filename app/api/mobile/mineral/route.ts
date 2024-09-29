import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const minerals = await prisma.minerals.findMany({
            orderBy: { id: "desc" }
        })

        return Response.json(minerals)
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}