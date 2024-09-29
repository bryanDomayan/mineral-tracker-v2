import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"
import dayjs from "dayjs"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, departmentId, note, minerals } = body

        const tempToday = await prisma.temperatures.findFirst({
            where: {
                createdAt: {
                    gte: dayjs().startOf("day").toDate(),
                    lte: dayjs().endOf("day").toDate()
                }
            }
        })

        const consume = await prisma.consumes.create({
            data: {
                userId: userId,
                departmentId: departmentId,
                note: note,
                tempId: tempToday?.id || null
            }
        })

        const consumeMinerals = await Promise.all(minerals.map(async (d: any) => {
            if (d?.value) {
                return prisma.consumeMinerals.create({
                    data: {
                        consumeId: consume.id,
                        mineralId: d.mineralId,
                        amount: parseFloat(d.value as string),
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