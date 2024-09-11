import { authProcedure, publicProcedure, router } from "../trpc";

export const usersRouter = router({
    getUsers: authProcedure.query(async ({ ctx, input }) => {
        console.log(ctx.req)
        return await ctx.prisma.users.findMany()
    })
})