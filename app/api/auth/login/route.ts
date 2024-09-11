import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authorize } from "@/lib/auth";
export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const auth = await authorize(email, password)

        if (!auth) {
            return NextResponse.json({message: "UNAUTHORIZED"}, { status: 401 });
        }
        cookies().set('serverToken', auth.token);
        return Response.json({message: 'success', data: { token: auth.token, ...auth.user } })
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}