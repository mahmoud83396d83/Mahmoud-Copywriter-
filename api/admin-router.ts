import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const totalOAuthUsers = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.users);

    const totalLocalUsers = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.localUsers);

    const totalContacts = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.contacts);

    const totalMessages = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.messages);

    const totalChatSessions = await getDb()
      .select({ count: sql<number>`count(*)` })
      .from(schema.chatSessions);

    return {
      totalUsers: (totalOAuthUsers[0]?.count ?? 0) + (totalLocalUsers[0]?.count ?? 0),
      totalOAuthUsers: totalOAuthUsers[0]?.count ?? 0,
      totalLocalUsers: totalLocalUsers[0]?.count ?? 0,
      totalContacts: totalContacts[0]?.count ?? 0,
      totalMessages: totalMessages[0]?.count ?? 0,
      totalChatSessions: totalChatSessions[0]?.count ?? 0,
    };
  }),

  userList: adminQuery.query(async () => {
    const oauthUsers = await getDb()
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users);

    const localUsersList = await getDb()
      .select({
        id: schema.localUsers.id,
        name: schema.localUsers.displayName,
        email: schema.localUsers.email,
        role: schema.localUsers.role,
        createdAt: schema.localUsers.createdAt,
      })
      .from(schema.localUsers);

    return [
      ...oauthUsers.map((u) => ({ ...u, authType: "oauth" as const })),
      ...localUsersList.map((u) => ({ ...u, authType: "local" as const })),
    ];
  }),

  updateUserRole: adminQuery
    .input(
      z.object({
        userId: z.number(),
        userType: z.enum(["oauth", "local"]),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      if (input.userType === "oauth") {
        await getDb()
          .update(schema.users)
          .set({ role: input.role })
          .where(eq(schema.users.id, input.userId));
      } else {
        await getDb()
          .update(schema.localUsers)
          .set({ role: input.role })
          .where(eq(schema.localUsers.id, input.userId));
      }

      return { success: true };
    }),
});
