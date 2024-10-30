import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"
import dayjs from "dayjs"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await mobileSession(req)
        const body = await req.json()
        const { note, minerals }: { note: string, minerals: any[] } = body

        const consume = await prisma.consumes.findUnique({
            where: { id: parseInt(params.id) }
        })

        const totalConsumed = minerals.reduce((acc, d) => {
            return acc + (parseFloat(d?.mineralSize as string || "0") * parseFloat(d?.quantity as string ||"0"))
        }, 0)

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
                note,
                totalConsumed: totalConsumed || 0
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const consume = await prisma.consumes.findUnique({
            where: { id: parseInt(params.id) }
        })

        if (consume) {
            await prisma.consumeMinerals.deleteMany({
                where: {
                    consumeId: consume.id
                }
            })

            await prisma.consumes.delete({
                where: { id: consume.id }
            })

            return Response.json(consume)
        }

        return Response.json("Failed to delete consumption", { status: 400 })
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}