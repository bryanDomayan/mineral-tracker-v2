import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server";
import { createContext } from "@/server/context";
// import { NextApiRequest, NextApiResponse } from "next";
// import { TRPCRequestInfo } from "@trpc/server/unstable-core-do-not-import";

const handler = async (req: Request) => 
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createContext(req)
    })

export { handler as GET, handler as POST }