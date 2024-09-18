import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authorize } from "@/lib/auth";
import { generateToken, verifyToken } from '@/utils/jwt';
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const auth = await authorize(email, password)

        if (!auth) {
            return NextResponse.json({message: "UNAUTHORIZED"}, { status: 401 });
        }
        return Response.json({ token: auth.token, ...auth.user })
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization")?.split(" ")

        if (authHeader?.length) {
            const token = authHeader[1]
            const data = await verifyToken(token)

            let copy = { ...data }
            delete copy.iat
            delete copy.exp
            
            return Response.json(copy)
        }
        return Response.json("Session expired", { status: 401 })
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}