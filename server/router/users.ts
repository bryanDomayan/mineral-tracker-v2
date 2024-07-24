import { procedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const usersRouter = router({
    getUsers: procedure.query(async () => {
        return await prisma.users.findMany()
    })
})