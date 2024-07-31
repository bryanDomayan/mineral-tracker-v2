import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utils/jwt';
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
    const token = cookies().get('serverToken')?.value
    const session = await verifyToken(token as string)
    if (!session) {
        return NextResponse.redirect(new URL("/api/auth/revoke",request.url))
    }
    return NextResponse.next()
}

export const config = {
    /**
     * Register all private route here
     */
    matcher: [
        '/dashboard'
    ],
}