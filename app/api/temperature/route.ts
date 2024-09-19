import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"

/**
 * This api should be trigger/call only every 5pm for accuratae temperature
 */
export async function GET(req: Request) {
    try {
        // temperature api for nwssu coordinate location
        const api_url = 'https://api.open-meteo.com/v1/forecast?latitude=12.071826213332008&longitude=124.59673724872216&hourly=temperature_2m&forecast_days=1&timezone=Asia%2FTokyo'

        const tempToday = await prisma.temperatures.findFirst({
            where: {
                createdAt: {
                    gte: dayjs().startOf("day").toDate(),
                    lte: dayjs().endOf("day").toDate()
                }
            }
        })
        if (tempToday) {
            return Response.json("Already created temperature today.")
        }

        const res = await fetch(api_url)
        const data = await res.json()

        const temps = data?.hourly?.time.map((d: string, i: number) => {
            return {
                time: d,
                temp: data?.hourly?.temperature_2m[i]
            }
        })

        let average = 0
        if (data?.hourly?.temperature_2m.length) {
            const numbers: number[] = data?.hourly?.temperature_2m
            const sum = numbers.reduce((total, num) => total + num, 0);
            average = sum / numbers.length;
        }

        await prisma.temperatures.create({
            data: {
                average: average,
                temps: temps,
            }
        })
        
        return Response.json("Temperature successfully created.")
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}