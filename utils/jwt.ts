import jwt from 'jsonwebtoken';
import { jwtVerify } from "jose";

export const generateToken = async (payload: any) => {
    const secret = process.env.JWT_SECRET as string
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return token
}

export const verifyToken = async (token: string) => {
    try {
        const secret = process.env.JWT_SECRET as string
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(secret)
        );
        return verified.payload;
    } catch (error) {
        return false
    }
}