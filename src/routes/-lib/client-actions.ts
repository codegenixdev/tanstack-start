import { createClientOnlyFn } from "@tanstack/react-start";

export const copyToClipboard = createClientOnlyFn(async (text: string) => {
	await navigator.clipboard.writeText(text);
	console.log("🔵 Copied to clipboard!");
	return true;
});
