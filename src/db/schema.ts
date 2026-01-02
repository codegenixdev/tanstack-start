import type { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const snippets = sqliteTable("snippets", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	language: text("language").notNull(),
	code: text("code").notNull(),
	description: text("description"),
	createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const createSnippetSchema = createSelectSchema(snippets, {
	createdAt: (schema) => schema.optional(),
	description: (schema) => schema.optional(),
	id: (schema) => schema.optional(),
});

export const updateSnippetSchema = createSelectSchema(snippets, {
	createdAt: (schema) => schema.optional(),
	description: (schema) => schema.optional(),
});

export type Snippet = InferSelectModel<typeof snippets>;
