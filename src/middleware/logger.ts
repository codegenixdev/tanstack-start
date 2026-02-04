import { createMiddleware } from "@tanstack/react-start";

export const loggerMiddleware = createMiddleware().server(
	// depending on state, it might run on client or server
	async ({ next, request }) => {
		const start = Date.now();
		const url = new URL(request.url).pathname;

		console.log(`🟢 [START] ${request.method} ${url}`);

		const result = await next();

		const duration = Date.now() - start;
		console.log(`🟢 [END] ${request.method} ${url} - ${duration}ms`);

		return result;
	},
);
