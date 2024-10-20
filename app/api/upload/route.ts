import { put } from '@vercel/blob';

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const file = req.body

        if (!file) {
            return Response.json("Uplaod failed!", { status: 400 })
        }

        const blob = await put(`${crypto.randomUUID()}.${type}`, req.body, {
            access: 'public',
        });

        return Response.json(blob.url)

    } catch (error:any) {
        return Response.json(error?.message || error, { status: error?.statusCode || 500 })
    }
}