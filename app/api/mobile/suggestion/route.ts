import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, name, brand, size, description } = body

        const suggestion = await prisma.suggestions.create({
            data: {
                userId: userId,
                name,
                brand,
                size,
                description
            }
        })

        return Response.json(suggestion)

    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)
        
        const suggestion = await prisma.suggestions.findMany({
            where: {
                userId: session?.id as number
            },
            orderBy: { id: "desc" }
        })
    
        return Response.json(suggestion)
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}