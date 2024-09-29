import { generateToken, verifyToken } from '@/utils/jwt';

export const mobileSession = async (req: Request) => {
    const authHeader = req.headers.get("authorization")?.split(" ")

    if (authHeader?.length) {
        const token = authHeader[1]
        const data = await verifyToken(token)

        let copy = { ...data }
        delete copy.iat
        delete copy.exp
        
        return copy
    }

    throw { message: "Unauthorized", statusCode: 401 }
}