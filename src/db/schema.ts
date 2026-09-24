import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  fullName: text('full_name').notNull().default(''),
  username: text('username').notNull().default(''),
  email: text('email').notNull(),
  role: text('role').notNull().default('Missionary'),
  country: text('country').notNull().default('Global'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const countries = pgTable('countries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  population: integer('population').notNull().default(0),
  religion: text('religion').notNull().default(''),
  evangelicalPercent: text('evangelical_percent').notNull().default('0%'),
  unreachedGroupsCount: integer('unreached_groups_count').notNull().default(0),
  riskLevel: text('risk_level').notNull().default('Moderate'),
  status: text('status').notNull().default('Open'),
  overview: text('overview').notNull().default(''),
  flagEmoji: text('flag_emoji').notNull().default('🏳️'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const upgs = pgTable('upgs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  countryId: text('country_id').notNull(),
  countryName: text('country_name').notNull().default(''),
  population: integer('population').notNull().default(0),
  language: text('language').notNull().default(''),
  primaryReligion: text('primary_religion').notNull().default(''),
  status: text('status').notNull().default('Unreached'),
  engagementLevel: text('engagement_level').notNull().default('Unengaged'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const prayerRequests = pgTable('prayer_requests', {
  id: serial('id').primaryKey(),
  author: text('author').notNull(),
  authorId: text('author_id').notNull(),
  title: text('title').notNull().default(''),
  content: text('content').notNull(),
  category: text('category').notNull().default('UPG'),
  targetCountryId: text('target_country_id'),
  targetUpgId: text('target_upg_id'),
  urgency: text('urgency').notNull().default('Medium'),
  prayedCount: integer('prayed_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  prayerRequests: many(prayerRequests),
}));

export const prayerRequestsRelations = relations(prayerRequests, ({ one }) => ({
  user: one(users, {
    fields: [prayerRequests.authorId],
    references: [users.uid],
  }),
}));
