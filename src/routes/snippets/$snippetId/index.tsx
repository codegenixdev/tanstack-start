import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, Check, Copy, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { db } from "@/db";
import { snippets } from "@/db/schema";

export const getSnippet = createServerFn({ method: "GET" })
	.inputValidator((params: { snippetId: string }) => params)
	.handler(async ({ data }) => {
		return await db.query.snippets.findFirst({
			where: eq(snippets.id, Number(data.snippetId)),
		});
	});

export const Route = createFileRoute("/snippets/$snippetId/")({
	component: SnippetDetail,
	loader: async ({ params }) => {
		return await getSnippet({ data: { snippetId: params.snippetId } });
	},
});

export default function SnippetDetail() {
	const snippet = Route.useLoaderData();
	const [isCopied, setIsCopied] = useState(false);
	const confirm = useConfirm();

	if (!snippet) {
		return "Snippet not found";
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(snippet.code);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	return (
		<div className="p-4 md:p-8 font-sans">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						className="pl-0 text-muted-foreground hover:text-foreground"
						asChild
					>
						<Link to="/">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Dashboard
						</Link>
					</Button>
				</div>

				<Card className="shadow-md overflow-hidden">
					<CardHeader className="bg-background border-b pb-6">
						<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<h1 className="text-3xl font-bold text-foreground">
										{snippet.title}
									</h1>
									<Badge
										variant="outline"
										className="text-sm px-3 py-1 uppercase tracking-wide"
									>
										{snippet.language}
									</Badge>
								</div>
								<div className="flex items-center text-sm text-muted-foreground gap-2">
									<Calendar className="h-4 w-4" />
									<span>Created on {snippet.createdAt}</span>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" asChild>
									<Link
										to="/snippets/$snippetId/edit"
										params={{
											snippetId: snippet.id.toString(),
										}}
									>
										<Pencil className="h-4 w-4 mr-2" />
										Edit
									</Link>
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={async () => {
										await confirm();
									}}
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete
								</Button>
							</div>
						</div>
					</CardHeader>

					<CardContent className="p-0 bg-slate-950 relative group">
						<Button
							variant="secondary"
							size="sm"
							className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 text-white hover:bg-white/20 hover:text-white border-0"
							onClick={handleCopy}
						>
							{isCopied ? (
								<>
									<Check className="h-4 w-4 mr-2" />
									Copied
								</>
							) : (
								<>
									<Copy className="h-4 w-4 mr-2" />
									Copy Code
								</>
							)}
						</Button>

						<div className="overflow-x-auto p-6 md:p-8">
							<pre className="text-sm md:text-base font-mono leading-relaxed text-slate-50">
								<code>{snippet.code}</code>
							</pre>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
