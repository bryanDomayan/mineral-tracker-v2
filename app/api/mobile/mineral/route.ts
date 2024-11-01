import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {
        const minerals = await prisma.minerals.findMany({
            orderBy: { id: "desc" },
        })

        return Response.json(minerals, {
            headers: { 'Cache-Control': 'no-store' }
        })
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}