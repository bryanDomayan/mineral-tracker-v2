import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const consumes = await prisma.consumes.findMany({
            where: {
                totalConsumed: null
            },
            include: {
                ConsumeMinerals: { include: { Mineral: true } }
            }
        })

        await Promise.all(consumes.map(async (d) => {
            const totalConsumed = d.ConsumeMinerals.reduce((acc, m) => {
                return acc + (m.amount * parseFloat(m.Mineral?.size as string || "0"))
            }, 0)

            return await prisma.consumes.update({
                where: { id: d.id },
                data: {
                    totalConsumed: totalConsumed
                }
            })
        }))
    
        return Response.json("success")
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}