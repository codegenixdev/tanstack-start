import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "@/db";
import { snippets, updateSnippetSchema } from "@/db/schema";

export const deleteSnippet = createServerFn({
	method: "POST",
}).handler(async ({ data }) => {
	await db.delete(snippets).where(eq(snippets.id, data.id));
	return { success: true };
});

export const useDeleteSnippet = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: (id: number) => deleteSnippet({ data: { id } }),
		onSuccess: () => {
			toast.success("Snippet deleted successfully");
			router.navigate({ to: "/snippets" });
			router.invalidate();
		},
		onError: () => {
			toast.error("Error deleting snippet");
		},
	});
};

export const updateSnippet = createServerFn({
	method: "POST",
})
	.inputValidator(updateSnippetSchema)
	.handler(async ({ data }) => {
		await db.update(snippets).set(data).where(eq(snippets.id, data.id));
		return { success: true };
	});

export const useUpdateSnippet = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: (data: typeof updateSnippetSchema.shape) => updateSnippet(data),
		onSuccess: () => {
			toast.success("Snippet updated successfully");
			router.invalidate();
		},
		onError: (error) => {
			console.log(error);
			toast.error("Error updating snippet");
		},
	});
};
