import { initTRPC } from '@trpc/server';
import { createContext } from './context';
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();

// Base router and procedure helpers
export const router = t.router;

export const publicProcedure = t.procedure;

const authorized = t.middleware(({ ctx, next }) => {
    return next({
        ctx: {
            auth: 'testing'
        }
    })
})

export const authProcedure = t.procedure.use(authorized)