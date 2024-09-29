import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"

/**
 * This api should be trigger/call only every 5pm for accuratae temperature
 */
export async function GET(req: Request) {
    try {
        // temperature api for nwssu coordinate location
        const api_url = 'https://api.open-meteo.com/v1/forecast?latitude=12.071826213332008&longitude=124.59673724872216&hourly=temperature_2m&forecast_days=1&timezone=Asia%2FSingapore'

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

        // Find the indices of the start and end times
        const startIndex = data?.hourly?.time.findIndex((x: any) => x.includes('06:00'));
        const endIndex = data?.hourly?.time.findIndex((x: any) => x.includes('20:00'));

        // Extract the time and temperature data within the specified range
        const filteredTimes = data?.hourly?.time.slice(startIndex, endIndex + 1);
        const filteredTemperatures = data?.hourly?.temperature_2m.slice(startIndex, endIndex + 1);

        const temps = filteredTimes.map((d: string, i: number) => {
            return {
                time: d,
                temp: filteredTemperatures[i]
            }
        })

        let average = 0
        if (filteredTemperatures.length) {
            const numbers: number[] = filteredTemperatures
            const sum = numbers.reduce((total, num) => total + num, 0);
            average = sum / numbers.length;
        }

        const temp = await prisma.temperatures.create({
            data: {
                average: average,
                temps: temps,
            }
        })

        // update all consumes
        const consumes = await prisma.consumes.findMany({
            where: {
                tempId: null,
                createdAt: {
                    gte: dayjs().startOf("day").toDate(),
                    lte: dayjs().endOf("day").toDate()
                }
            }
        })
        if (consumes.length) {
            await Promise.all(consumes.map(async (d) => {
                return prisma.consumes.update({
                    where: { id: d.id },
                    data: {
                        tempId: temp.id
                    }
                })
            }))
        }
        
        return Response.json("Temperature successfully created.")
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}