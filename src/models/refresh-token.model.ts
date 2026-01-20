import { pgTable, text, timestamp, bigint, index, uuid } from 'drizzle-orm/pg-core';
import { users } from './user.model';

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: bigint('user_id', { mode: 'bigint' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').unique().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('refresh_tokens_user_id_idx').on(table.userId),
    index('refresh_tokens_token_idx').on(table.token),
  ]
);

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
