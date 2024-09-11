import { testRouter } from "./router/test";
import { usersRouter } from "./router/users";
import { router } from "./trpc";

/**
 * Register your router here
 */
export const appRouter = router({
  test: testRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
