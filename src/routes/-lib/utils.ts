import { createIsomorphicFn, createServerOnlyFn } from "@tanstack/react-start";

export const logMessage = createIsomorphicFn()
	.server(() => ({ type: "server", platform: process.platform }))
	.client(() => ({ type: "client", userAgent: navigator.userAgent }));

export const getDatabaseUrl = createServerOnlyFn(() => {
	return process.env.DATABASE_URL!;
});
