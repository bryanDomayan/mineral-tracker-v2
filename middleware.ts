import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utils/jwt';
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const token = cookies().get('serverToken')?.value
    if (path.startsWith('/login')) {
        if (token) {
            return NextResponse.redirect(new URL("/statistic",request.url))
        }
        return NextResponse.next()
    }
    const session = await verifyToken(token as string)
    if (!session) {
        return NextResponse.redirect(new URL("/api/auth/revoke",request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/login', // public route
        '/statistic',
        '/dashboard'
    ],
}