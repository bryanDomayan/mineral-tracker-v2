import { prisma } from "@/lib/prisma"
import { matchPassword } from "@/utils/password"
import { generateToken } from "@/utils/jwt";

export const authorize = async (email: string, password: string) => {
    const user = await prisma.users.findUnique({
        where: { email: email as string }
    })
    if (!user) {
        return null
    }

    const isMatch = await matchPassword(password, user.password)
    if (isMatch) {
        const token = await generateToken(user)
        return {
            user: user,
            token: token
        }
    }

    return null
}