import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    displayName: text('display_name').notNull().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
    companies: many(companies),
}));

export const companies = sqliteTable('companies', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    ownerId: text('owner_id')
        .notNull()
        .references(() => users.id),
    money: integer('money', { mode: 'number' }).notNull().default(0),
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
    owner: one(users, { fields: [companies.ownerId], references: [users.id] }),
    resources: many(resources),
}));

export const resources = sqliteTable(
    'resources',
    {
        companyId: integer('company_id', { mode: 'number' }).references(() => companies.id),
        type: text('type').notNull(),
        amount: integer('amount', { mode: 'number' }).notNull().default(0),
    },
    (table) => ({
        pk: primaryKey(table.companyId, table.type),
    }),
);

export const resourcesRelations = relations(resources, ({ one }) => ({
    company: one(companies, { fields: [resources.companyId], references: [companies.id] }),
}));
