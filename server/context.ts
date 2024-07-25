// /* eslint-disable @typescript-eslint/no-unused-vars */
// import type * as trpcNext from '@trpc/server/adapters/next';

// // eslint-disable-next-line @typescript-eslint/no-empty-interface
// interface CreateContextOptions {
//     // session: Session | null
//     auth?: any | null
// }

// /**
//  * Inner function for `createContext` where we create the context.
//  * This is useful for testing when we don't want to mock Next.js' request/response
//  */
// export async function createContextInner(_opts: CreateContextOptions) {
//     const { req, res } = _opts
//     return {
//         _opts
//     };
// }

// export type Context = Awaited<ReturnType<typeof createContextInner>>;

// /**
//  * Creates context for an incoming request
//  * @link https://trpc.io/docs/v11/context
//  */
// export async function createContext(
//     opts: trpcNext.CreateNextContextOptions,
// ): Promise<Context> {
//     // for API-response caching see https://trpc.io/docs/v11/caching

//     return await createContextInner({});
// }

import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@/lib/prisma';
/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions {
    auth?: any
}
/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @link https://trpc.io/docs/v11/context#inner-and-outer-context
 */
export async function createContextInner() {
    return {
        prisma,
    };
}
/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @link https://trpc.io/docs/v11/context#inner-and-outer-context
 */
export async function createContext(opts?: any) {
    // return await createContextInner()
    const contextInner = await createContextInner();
    return {
        ...contextInner,
        req: opts,
    };
}
export type Context = Awaited<ReturnType<typeof createContextInner>>;
// The usage in your router is the same as the example above.