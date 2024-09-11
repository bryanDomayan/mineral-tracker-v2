import { prisma } from "@/lib/prisma"
import { generateToken, verifyToken } from "@/utils/jwt";
import { matchPassword } from "@/utils/password"
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        const user = await prisma.users.findUnique({
            where: { email: email as string }
        })
        if (!user) {
            return NextResponse.json({message: "UNAUTHORIZED"}, { status: 401 });
        }
        const isMatch = await matchPassword(password, user.password)
        if (isMatch) {
            const token = await generateToken(user)
            cookies().set('serverToken', token);
            return Response.json({message: 'success', data: { token, ...user } })
        }
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}