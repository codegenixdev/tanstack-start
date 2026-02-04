import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { loggerMiddleware } from "@/middleware/logger";

export const Route = createFileRoute("/hello")({
	server: {
		handlers: ({ createHandlers }) =>
			createHandlers({
				POST: {
					middleware: [loggerMiddleware],
					handler: async ({ request }) => {
						return new Response(`Hello, World! from ${request.url}`);
					},
				},
			}),
	},
	component: HelloPage,
});

function HelloPage() {
	const [reply, setReply] = useState("");

	const handleClick = async () => {
		const res = await fetch("/hello", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: "Tanner" }),
		});
		const data = await res.json();
		setReply(data.message);
	};

	return (
		<div>
			<button type="button" onClick={handleClick}>
				Say Hello
			</button>
			{reply && <p>{reply}</p>}
		</div>
	);
}
