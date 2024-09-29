import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)
        const details = await prisma.users.findUnique({
            where: { id: session?.id as number },
            include: { Department: true }
        })
        return Response.json(details)
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}