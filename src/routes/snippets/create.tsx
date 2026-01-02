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
		mutationFn: (data: {
			title: string;
			language: string;
			code: string;
			description: string;
		}) => createSnippet({ data }),
		onSuccess: () => {
			toast.success("Snippet created successfully");
			router.invalidate();
		},
		onError: () => {
			toast.error("Error during creating snippet");
		},
	});
};

export const Route = createFileRoute("/snippets/create")({
	component: CreateSnippet,
});

export default function CreateSnippet() {
	const createSnippetMutation = useCreateSnippet();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const title = formData.get("title") as string;
		const language = formData.get("language") as string;
		const code = formData.get("code") as string;
		const description = formData.get("description") as string;
		createSnippetMutation.mutate({
			title,
			language,
			code,
			description,
		});
	};
	return (
		<div className="p-4 md:p-8 font-sans flex items-center justify-center">
			<Card className="w-full max-w-2xl shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
					<div className="flex flex-col gap-1">
						<CardTitle className="text-2xl font-bold flex items-center gap-2">
							Add Snippet
						</CardTitle>
						<CardDescription>
							Save a reusable code block to your personal library.
						</CardDescription>
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link to="..">
							<ChevronLeft className="mr-1 h-4 w-4" />
							Back
						</Link>
					</Button>
				</CardHeader>

				<CardContent className="pt-6 space-y-6">
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									name="title"
									placeholder="e.g., React Auth Hook"
									className="bg-background"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="language">Language</Label>
								<Select name="language">
									<SelectTrigger className="bg-background">
										<SelectValue placeholder="Select language" />
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

						<div className="space-y-2">
							<Label htmlFor="code">Code</Label>
							<div className="relative">
								<Textarea
									name="code"
									placeholder="// Paste your code here..."
									className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50 border-slate-800 placeholder:text-slate-500 resize-y"
								/>
								<Input
									className="bg-background mt-3"
									name="description"
									placeholder="Description..."
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<Button variant="ghost" type="button" asChild>
								<Link to="..">Cancel</Link>
							</Button>
							<Button type="submit" className="min-w-[120px]">
								{createSnippetMutation.isPending ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Save className="mr-2 h-4 w-4" />
								)}
								Save Snippet
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
