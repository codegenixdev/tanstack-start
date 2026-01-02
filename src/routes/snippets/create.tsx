import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { createSnippetSchema, snippets } from "@/db/schema";

const createSnippet = createServerFn({
	method: "POST",
})
	.inputValidator(createSnippetSchema)
	.handler(async ({ data }) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		await db.insert(snippets).values(data);
		return { success: true };
	});

const useCreateSnippet = () => {
	const router = useRouter();
	return useMutation({
		mutationFn: createSnippet,
		onSuccess: () => {
			toast.success("Snippet created successfully");
			router.invalidate();
			router.navigate({ to: ".." });
		},
		onError: () => {
			toast.error("Failed to create snippet");
		},
	});
};

export const Route = createFileRoute("/snippets/create")({
	component: CreateSnippet,
});

export default function CreateSnippet() {
	const mutation = useCreateSnippet();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const data = {
			title: formData.get("title") as string,
			language: formData.get("language") as string,
			code: formData.get("code") as string,
			description: formData.get("description") as string,
		};

		mutation.mutate({ data });
	};

	return (
		<div className="p-4 md:p-8 font-sans flex items-center justify-center min-h-screen bg-background">
			<Card className="w-full max-w-3xl shadow-xl">
				<CardHeader className="flex flex-row items-center justify-between pb-6 border-b">
					<div>
						<CardTitle className="text-2xl font-bold">
							Create New Snippet
						</CardTitle>
						<CardDescription className="mt-1">
							Save a reusable code snippet to your library.
						</CardDescription>
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link to="..">
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back
						</Link>
					</Button>
				</CardHeader>

				<CardContent className="pt-8">
					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Title + Language */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									name="title"
									placeholder="e.g., React Auth Hook"
									required
									className="bg-background"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="language">Language</Label>
								<Select name="language" required>
									<SelectTrigger name="language">
										<SelectValue placeholder="Select a language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="typescript">TypeScript</SelectItem>
										<SelectItem value="javascript">JavaScript</SelectItem>
										<SelectItem value="python">Python</SelectItem>
										<SelectItem value="css">CSS</SelectItem>
										<SelectItem value="sql">SQL</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Code */}
						<div className="space-y-2">
							<Label htmlFor="code">Code</Label>
							<Textarea
								name="code"
								placeholder="// Paste or write your code here..."
								className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50 resize-y"
								required
							/>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Description (optional)</Label>
							<Input
								name="description"
								placeholder="Briefly describe what this snippet does..."
								className="bg-background"
							/>
						</div>

						{/* Actions */}
						<div className="flex justify-end gap-4 pt-6 border-t">
							<Button type="button" variant="ghost" asChild>
								<Link to="..">Cancel</Link>
							</Button>

							<Button
								type="submit"
								disabled={mutation.isPending}
								className="min-w-[140px]"
							>
								{mutation.isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Save Snippet
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
