import { z } from "zod/v4";

export const snippetSearchSchema = z.object({
	search: z.string().default("").catch(""),
	language: z.string().default("all").catch("all"),
});
