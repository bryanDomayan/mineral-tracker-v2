export const fetchCache = "force-no-store"

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const minerals = await prisma.minerals.findMany({
            orderBy: { id: "desc" },
        })

        return Response.json(minerals, {
            headers: { 'Cache-Control': 'no-store' }
        })
    } catch (error) {
        return NextResponse.json(error, { status: 500 })
    }
}

export const revalidate = 0;