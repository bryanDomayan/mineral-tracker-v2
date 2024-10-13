import { prisma } from "@/lib/prisma"
import { mobileSession } from "@/utils/auth"
import dayjs from "dayjs"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const { mode, quantity } = body

        if (mode == "edit") {
            await prisma.stocks.update({
                where: { id: parseInt(params.id) },
                data: {
                    quantity: parseInt(quantity),
                    updatedAt: dayjs().toDate()
                }
            })
        }else {
            const stock = await prisma.stocks.findUnique({
                where: { id: parseInt(params.id) }
            })
            await prisma.stocks.update({
                where: { id: parseInt(params.id) },
                data: {
                    quantity: (stock?.quantity||0) + parseInt(quantity),
                    updatedAt: dayjs().toDate()
                }
            })
        }

        return Response.json("Stock successfully updated!")

    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}