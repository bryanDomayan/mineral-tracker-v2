import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"
import dayjs from "dayjs"

export async function POST(req: Request) {
    try {
        const session = await mobileSession(req)
        const body = await req.json()
        const { note, minerals }: { note: string, minerals: any[] } = body

        const tempToday = await prisma.temperatures.findFirst({
            where: {
                createdAt: {
                    gte: dayjs().startOf("day").toDate(),
                    lte: dayjs().endOf("day").toDate()
                }
            }
        })

        const totalConsumed = minerals.reduce((acc, d) => {
            return acc + (parseFloat(d?.mineralSize as string || "0") * parseFloat(d?.quantity as string ||"0"))
        }, 0)

        const consume = await prisma.consumes.create({
            data: {
                userId: session?.id as number,
                departmentId: session?.departmentId as number,
                note: note,
                tempId: tempToday?.id || null,
                totalConsumed: totalConsumed || 0
            }
        })

        const consumeMinerals = await Promise.all(minerals.map(async (d: any) => {
            if (d?.quantity) {
                const stock = await prisma.stocks.findFirst({
                    where: {
                        userId: session?.id as number,
                        mineralId: d.mineralId
                    }
                })

                if (stock && stock.quantity > 0) {
                    const remaining = stock.quantity - (parseInt(d?.quantity))
                    await prisma.stocks.update({
                        where: { id: stock.id },
                        data: {
                            quantity: remaining > 0 ? remaining : 0,
                            updatedAt: dayjs().toDate()
                        }
                    })
                }

                return await prisma.consumeMinerals.create({
                    data: {
                        consumeId: consume.id,
                        mineralId: d.mineralId,
                        amount: parseFloat(d.quantity as string),
                    },
                });
            }
        }));

        return Response.json({ consumeMinerals, ...consume })

    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)
        
        const consumes = await prisma.consumes.findMany({
            where: {
                userId: session?.id as number
            },
            include: {
                ConsumeMinerals: { include: { Mineral: true } },
                Temperature: true
            },
            orderBy: { id: "desc" }
        })
    
        return Response.json(consumes)
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}