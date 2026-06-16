import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware.js";
import { getDb } from "./queries/connection.js";
import * as schema from "../db/schema.js";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        service: z.string().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const result = await getDb()
        .insert(schema.contacts)
        .values({
          name: input.name,
          email: input.email,
          service: input.service || null,
          message: input.message,
        });

      return { success: true, id: Number(result[0].insertId) };
    }),

  list: adminQuery.query(async () => {
    return getDb()
      .select()
      .from(schema.contacts)
      .orderBy(desc(schema.contacts.createdAt));
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "replied"]),
      })
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(schema.contacts)
        .set({ status: input.status })
        .where(eq(schema.contacts.id, input.id));

      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await getDb()
        .delete(schema.contacts)
        .where(eq(schema.contacts.id, input.id));

      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const total = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.contacts);

    const newCount = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.contacts)
      .where(eq(schema.contacts.status, "new"));

    const replied = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.contacts)
      .where(eq(schema.contacts.status, "replied"));

    return {
      total: total[0]?.count ?? 0,
      new: newCount[0]?.count ?? 0,
      replied: replied[0]?.count ?? 0,
    };
  }),
});
