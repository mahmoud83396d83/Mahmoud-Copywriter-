import { z } from "zod";
import { desc, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const guestbookRouter = createRouter({
  list: publicQuery.query(async () => {
    return getDb()
      .select()
      .from(schema.messages)
      .orderBy(desc(schema.messages.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input }) => {
      const result = await getDb()
        .insert(schema.messages)
        .values({
          name: input.name,
          email: input.email,
          content: input.content,
        });

      const newMessage = await getDb()
        .select()
        .from(schema.messages)
        .where(eq(schema.messages.id, Number(result[0].insertId)))
        .limit(1);

      return { success: true, message: newMessage[0] };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb()
        .delete(schema.messages)
        .where(eq(schema.messages.id, input.id));

      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const result = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.messages);

    return { total: result[0]?.count ?? 0 };
  }),
});
