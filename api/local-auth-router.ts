import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import * as schema from "../db/schema.js";
import { hashPassword, comparePassword, signLocalToken } from "./local-auth-utils.js";

export const localAuthRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(6),
        displayName: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Check if username exists
      const existing = await getDb()
        .select()
        .from(schema.localUsers)
        .where(eq(schema.localUsers.username, input.username))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      const passwordHash = await hashPassword(input.password);

      await getDb()
        .insert(schema.localUsers)
        .values({
          username: input.username,
          passwordHash,
          displayName: input.displayName || input.username,
          email: input.email || null,
        });

      const newUser = await getDb()
        .select()
        .from(schema.localUsers)
        .where(eq(schema.localUsers.username, input.username))
        .limit(1);

      const user = newUser[0];
      const token = await signLocalToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          name: user.displayName || user.username,
          role: user.role,
        },
      };
    }),

  login: publicQuery
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(schema.localUsers)
        .where(eq(schema.localUsers.username, input.username))
        .limit(1);

      const user = rows.at(0);
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const valid = await comparePassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });
      }

      const token = await signLocalToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          name: user.displayName || user.username,
          role: user.role,
        },
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.localUser) return null;
    return {
      id: ctx.localUser.id,
      username: ctx.localUser.username,
      displayName: ctx.localUser.displayName,
      name: ctx.localUser.displayName || ctx.localUser.username,
      email: ctx.localUser.email,
      role: ctx.localUser.role,
    };
  }),
});
