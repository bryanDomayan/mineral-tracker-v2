import { NextResponse } from 'next/server';
import dayjs from 'dayjs';
import { prisma } from '@/lib/prisma';
import { mobileSession } from '@/utils/auth';

export async function GET(req: Request) {
    try {
        const session = await mobileSession(req)
        // return NextResponse.json({start: dayjs().toDate(), end: dayjs(dayjs()).add(6, 'day').toDate()})
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
        }

        let date = dayjs(startDate).toDate(); // Ensure it's a valid date
        const end = dayjs(endDate).toDate(); // Convert endDate properly
        let dates: any[] = [];

        // Loop until the current date matches the end date
        while (!dayjs(date).isSame(end, 'day')) {
            dates.push(date);
            date = dayjs(date).add(1, 'day').toDate();
        }
        dates.push(end); // Include the last date

        dates.reverse()
        const data = await Promise.all(dates.map(async (d) => {
            const temperature = await prisma.temperatures.findFirst({
                where: {
                    createdAt: {
                        gte: dayjs(d).startOf("day").toDate(),
                        lte: dayjs(d).endOf("day").toDate()
                    }
                }
            })

            const consumes = await prisma.consumes.findMany({
                where: {
                    userId: session?.id as number,
                    createdAt: {
                        gte: dayjs(d).startOf("day").toDate(),
                        lte: dayjs(d).endOf("day").toDate()
                    }
                },
                include: {
                    ConsumeMinerals: {
                        include: {
                            Mineral: true
                        }
                    }
                }
            })

            const total = consumes.reduce((acc, d) => {
                const totalPerConsume = d.ConsumeMinerals.reduce((tpAcc, c) => {
                    let init = c.amount * (parseInt(c.Mineral?.size as string|| '0'))
                    return tpAcc + init
                }, 0)
                return acc + totalPerConsume
            }, 0)

            return {
                date: d,
                average_temperature: temperature?.average || null,
                total_consumed: total
            }
        }))

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'An error occurred' }, { status: 500 });
    }
}