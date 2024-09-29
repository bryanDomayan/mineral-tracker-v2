import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { prisma } from '@/lib/prisma';
import { mobileSession } from '@/utils/auth';

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)

        const api_url = 'https://api.open-meteo.com/v1/forecast?latitude=12.071826213332008&longitude=124.59673724872216&current=temperature_2m&forecast_days=1&timezone=Asia%2FSingapore'
        const resTemp = await fetch(api_url)
        const dataTemp = await resTemp.json()


        const totalConsumed = await prisma.consumes.aggregate({
            _sum: { totalConsumed: true },
            where: {
                userId: session?.id as number
            }
        })

        const suggestionCount = await prisma.suggestions.count({
            where: {
                userId: session?.id as number
            }
        })

        const data = {
            current_temperature: dataTemp?.current?.temperature_2m|0,
            total_consumed: totalConsumed._sum.totalConsumed,
            total_suggestion: suggestionCount
        }
        
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'An error occurred' }, { status: 500 });
    }
}