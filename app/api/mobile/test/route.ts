import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
    try {

        const consumes = await prisma.consumes.findMany({
            include: {
                ConsumeMinerals: {
                    include: {
                        Mineral: true
                    }
                }
            }
        })

        const data = await Promise.all(consumes.map(async (d) => {
            const total = d.ConsumeMinerals.reduce((acc, c) => {
                return c.amount * parseFloat(c.Mineral?.size as string)
            }, 0)

            await prisma.consumes.update({
                where: { id: d.id },
                data: {
                    totalConsumed: total
                }
            })

            return {
                id: d.id,
                total
            }
        }))

        return Response.json(data)
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}