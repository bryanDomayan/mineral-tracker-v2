import { publicProcedure, router } from "../trpc";

export const testRouter = router({
    getTest: publicProcedure.query(async () => {
        return [35, 64, 31]
    })
})