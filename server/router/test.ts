import { procedure, router } from "../trpc";

export const testRouter = router({
    getTest: procedure.query(async () => {
        return [35, 64, 31]
    })
})