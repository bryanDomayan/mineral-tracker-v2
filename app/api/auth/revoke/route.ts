import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function GET(req: Request) {
    try {
        cookies().delete('serverToken')
        return NextResponse.redirect(new URL('/login', req.url))
    } catch (error) {
        return Response.json(error, { status: 500 })
    }
}