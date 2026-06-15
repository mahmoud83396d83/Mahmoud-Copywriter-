import * as jose from "jose";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { env } from "./lib/env";
import { getDb } from "./queries/connection";
import * as schema from "@db/schema";
import type { LocalUser } from "@db/schema";

const secret = new TextEncoder().encode(env.localAuthSecret);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signLocalToken(payload: { userId: number; username: string; role: string }): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyLocalToken(token: string): Promise<LocalUser | undefined> {
  try {
    const { payload } = await jose.jwtVerify(token, secret, { clockTolerance: 60 });
    const userId = payload.userId as number;
    if (!userId) return undefined;

    const rows = await getDb()
      .select()
      .from(schema.localUsers)
      .where(eq(schema.localUsers.id, userId))
      .limit(1);

    return rows.at(0);
  } catch {
    return undefined;
  }
}
