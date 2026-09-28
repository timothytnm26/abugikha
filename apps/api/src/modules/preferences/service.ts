import { eq } from "drizzle-orm";
import { PreferencesSchema, type Preferences, type PreferencesResponse } from "@abugikha/contracts";
import { schema, type Database } from "../../db/client";
import { toIso } from "../../lib/time";

/** Parse lại khi đọc để bản ghi cũ tự nhận giá trị mặc định của trường mới. */
const normalize = (data: unknown): Preferences => {
  const parsed = PreferencesSchema.safeParse(data);
  return parsed.success ? parsed.data : PreferencesSchema.parse({});
};

export async function getPreferences(db: Database, userId: string): Promise<PreferencesResponse> {
  const row = await db.query.userPreferences.findFirst({ where: eq(schema.userPreferences.userId, userId) });
  return { preferences: normalize(row?.data), updatedAt: row ? toIso(row.updatedAt) : null };
}

export async function putPreferences(db: Database, userId: string, prefs: Preferences): Promise<PreferencesResponse> {
  const now = new Date();
  await db
    .insert(schema.userPreferences)
    .values({ userId, data: prefs, updatedAt: now })
    .onConflictDoUpdate({ target: schema.userPreferences.userId, set: { data: prefs, updatedAt: now } });
  return { preferences: prefs, updatedAt: toIso(now) };
}
