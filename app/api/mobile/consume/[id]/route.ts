import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"
import dayjs from "dayjs"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await mobileSession(req)
        const body = await req.json()
        const { note, minerals } = body

        const consume = await prisma.consumes.findUnique({
            where: { id: parseInt(params.id) }
        })

        const consumeMinerals = await Promise.all(minerals.map(async (d: any) => {
            if (d?.consumeMineralId) {
                return await prisma.consumeMinerals.update({
                    where: { id: d?.consumeMineralId },
                    data: {
                        amount: parseInt(d?.quantity as string),
                    },
                });
            }else {
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
                        consumeId: consume?.id as number,
                        mineralId: d.mineralId,
                        amount: parseInt(d?.quantity as string),
                    },
                });
            }
        }));

        await prisma.consumes.update({
            where: { id: consume?.id as number },
            data: {
                note
            }
        })

        return Response.json({ consumeMinerals, ...consume })

    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const consume = await prisma.consumes.findUnique({
            where: {
                id: parseInt(params.id)
            },
            include: {
                ConsumeMinerals: { include: { Mineral: true } },
                Temperature: true
            }
        })
    
        return Response.json(consume)
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}