import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { loggerMiddleware } from "@/middleware/logger";

const getSnippets = createServerFn({
	method: "GET",
})
	.middleware([loggerMiddleware])
	.inputValidator((data: { search: string; language: string }) => data)
	.handler(async ({ data }) => {
		const conditions = [];

		if (data?.search?.trim()) {
			const likePattern = `%${data.search.trim()}%`;
			conditions.push(
				or(
					like(snippets.title, likePattern),
					like(snippets.description, likePattern),
				),
			);
		}

		if (data?.language && data.language !== "all") {
			conditions.push(eq(snippets.language, data.language));
		}

		if (conditions.length === 0) {
			return await db.query.snippets.findMany();
		}

		return await db.query.snippets.findMany({
			where: conditions.length > 1 ? and(...conditions) : conditions[0],
		});
	});

export const snippetsQueryOptions = (
	search: string = "",
	language: string = "all",
) =>
	queryOptions({
		queryKey: ["snippets", search, language],
		queryFn: () => getSnippets({ data: { search, language } }),
	});

const getSnippet = createServerFn({ method: "GET" })
	.inputValidator((params: { snippetId: string }) => params)
	.handler(async ({ data }) => {
		const snippet = await db.query.snippets.findFirst({
			where: eq(snippets.id, Number(data.snippetId)),
		});
		return snippet ?? null;
	});

export const getSnippetQueryOptions = (snippetId: string) =>
	queryOptions({
		queryKey: ["snippet", snippetId],
		queryFn: () => getSnippet({ data: { snippetId } }),
	});
