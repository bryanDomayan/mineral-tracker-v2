import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/utils/password"
export async function GET(req: Request) {
    try {
        const password = await hashPassword('123123123')
        const user = await prisma.users.create({
            data: {
                firstName: "Mark Leouie",
                lastName: "Tabique",
                email: "mark@test.com",
                password: password
            }
        })

        return Response.json(user)
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}