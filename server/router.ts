import { authRouter } from "./auth-router.js";
import { localAuthRouter } from "./local-auth-router.js";
import { contactRouter } from "./contact-router.js";
import { guestbookRouter } from "./guestbook-router.js";
import { adminRouter } from "./admin-router.js";
import { chatRouter } from "./chat-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  contact: contactRouter,
  guestbook: guestbookRouter,
  admin: adminRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
