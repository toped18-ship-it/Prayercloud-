import { db } from './index.ts';
import { users, countries, upgs, prayerRequests } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string, fullName = '', role = 'Missionary', country = 'Global') {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        fullName,
        role,
        country,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          fullName,
          role,
          country,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Database operation failed.', { cause: error });
  }
}

export async function getAllCountries() {
  try {
    return await db.select().from(countries);
  } catch (error) {
    console.error('Database getAllCountries failed:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function getAllUPGs() {
  try {
    return await db.select().from(upgs);
  } catch (error) {
    console.error('Database getAllUPGs failed:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}

export async function getPrayerRequests() {
  try {
    return await db.select().from(prayerRequests);
  } catch (error) {
    console.error('Database getPrayerRequests failed:', error);
    throw new Error('Database query failed.', { cause: error });
  }
}
