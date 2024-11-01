import { NextResponse } from 'next/server';
import { hashPassword, matchPassword } from '@/utils/password';
import { mobileSession } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { password, newPassword } = await req.json()

        const session = await mobileSession(req)
        const user = await prisma.users.findUnique({
            where: { id: session?.id as number },
        })

        const isMatched = await matchPassword(password, user?.password as string)

        if (!isMatched) {
            return NextResponse.json({message: "Old password does not matched."}, { status: 400 });
        }
        
        const hashNewPass = await hashPassword(newPassword)
        await prisma.users.update({
            where: { id: user?.id as number },
            data: {
                password: hashNewPass
            }
        })

        return Response.json({ status: "success" })
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}