import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { ArrowLeft, PencilLine, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { snippets, updateSnippetSchema } from "@/db/schema";
import { getSnippet } from "@/routes/snippets/$snippetId";

export const Route = createFileRoute("/snippets/$snippetId/edit")({
	component: EditSnippet,
	loader: async ({ params }) => {
		return await getSnippet({ data: { snippetId: params.snippetId } });
	},
});

const updateSnippet = createServerFn({
	method: "POST",
})
	.inputValidator(updateSnippetSchema)
	.handler(async ({ params }) => {
		await db.update(snippets).set(params).where(eq(snippets.id, params.id));
		return { success: true };
	});

export default function EditSnippet() {
	const snippet = Route.useLoaderData();
	if (!snippet) {
		return "Snippet not found";
	}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const title = formData.get("title") as string;
		const language = formData.get("language") as string;
		const code = formData.get("code") as string;
		const description = formData.get("description") as string;
		try {
			await updateSnippet({
				data: {
					id: Number(snippet.id),
					title,
					language,
					code,
					description,
				},
			});
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<div className="p-4 md:p-8 font-sans flex items-center justify-center">
			<Card className="w-full max-w-2xl shadow-lg">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
					<div className="flex flex-col gap-1">
						<CardTitle className="text-2xl font-bold flex items-center gap-2">
							<PencilLine className="h-6 w-6 text-orange-500" />
							Edit Snippet
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Editing{" "}
							<span className="font-semibold text-foreground">
								"{snippet.title}"
							</span>
						</p>
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link to="..">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Cancel
						</Link>
					</Button>
				</CardHeader>

				<CardContent className="pt-6 space-y-6">
					<form onSubmit={handleSubmit}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input defaultValue={snippet.title} className="bg-background" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="language">Language</Label>
								<Select defaultValue={snippet.language}>
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
									defaultValue={snippet.code}
									className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50 border-slate-800 focus-visible:ring-orange-500"
								/>

								<Input
									className="mt-3"
									name="description"
									defaultValue={snippet.description || ""}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<input type="hidden" name="id" value={snippet.id} />

							<Button variant="ghost" type="button" asChild>
								<Link to="..">Cancel</Link>
							</Button>
							<Button type="submit" className="min-w-[150px]">
								<Save className="mr-2 h-4 w-4" />
								Update Changes
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
