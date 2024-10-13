import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"
import dayjs from "dayjs"

export async function POST(req: Request) {
    try {
        const session = await mobileSession(req)
        const body = await req.json()
        const { mineralId, quantity } = body

        const existStocks = await prisma.stocks.findFirst({
            where: {
                mineralId,
                userId: session?.id as number
            }
        })

        if (existStocks) {
            await prisma.stocks.update({
                where: { id: existStocks.id },
                data: {
                    quantity: existStocks.quantity + parseInt(quantity),
                    updatedAt: dayjs().toDate()
                }
            })

            return Response.json(existStocks)
        }else {
            const newStock = await prisma.stocks.create({
                data: {
                    quantity: parseInt(quantity),
                    mineralId,
                    userId: session?.id as number
                }
            })

            return Response.json(newStock)
        }
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)

        const stocks = await prisma.stocks.findMany({
            where: {
                userId: session?.id as number
            },
            include: {
                Mineral: true
            },
            orderBy: { createdAt: "desc" }
        })
    
        return Response.json(stocks)
    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}