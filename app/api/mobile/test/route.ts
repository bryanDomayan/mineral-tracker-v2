import { prisma } from "@/lib/prisma"
export async function GET(req: Request) {
    try {
        const users = await prisma.users.findMany()

        return Response.json(users)
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}