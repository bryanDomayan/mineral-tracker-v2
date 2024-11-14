import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)
        // const user = await prisma.users.find
        return Response.json("Session expired", { status: 401 })
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}