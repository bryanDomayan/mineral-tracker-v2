import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"
import dayjs from "dayjs"

export async function POST(req: Request) {
    try {
        const session = await mobileSession(req)
        const body = await req.json()
        const { cubicConsumed, bill, date } = body

        const tempToday = await prisma.temperatures.findFirst({
            where: {
                createdAt: {
                    gte: dayjs().startOf("day").toDate(),
                    lte: dayjs().endOf("day").toDate()
                }
            }
        })

        const consume = await prisma.portableConsumes.create({
            data: {
                userId: session?.id as number,
                departmentId: session?.departmentId as number,
                tempId: tempToday?.id || null,
                cubicConsumed: parseFloat(cubicConsumed),
                bill: parseFloat(bill),
                date: dayjs(date).toDate()
            }
        })

        return Response.json(consume)

    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)

        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year');
        const startDate = dayjs(`${year}-01-01`).startOf('year').toDate();
        const endDate = dayjs(`${year}-12-31`).endOf('year').toDate();
        
        const items = await prisma.portableConsumes.findMany({
            where: {
                userId: session?.id as number,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                Temperature: true
            },
            orderBy: { id: "desc" }
        })

        const total = await prisma.portableConsumes.aggregate({
            _sum: { cubicConsumed: true, bill: true },
            where: {
                userId: session?.id as number,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        })
    
        return Response.json({
            items,
            total: {
                cubicConsumed: total._sum.cubicConsumed,
                bill: total._sum.bill
            }
        })
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}