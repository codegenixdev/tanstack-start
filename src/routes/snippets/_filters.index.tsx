import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { mockSnippets } from "@/routes/-lib/mock";

export const Route = createFileRoute("/snippets/_filters/")({
	component: Snippets,
	pendingComponent: () => <>Loading...</>,
});

function Snippets() {
	const { search, language } = Route.useSearch();

	return (
		<>
			<div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{mockSnippets.map((snippet) => (
					<SnippetCard key={snippet.id} snippet={snippet} />
				))}
			</div>

			{mockSnippets.length === 0 && (
				<div className="text-center py-20">
					<p className="text-muted-foreground">
						No snippets found.{" "}
						{search || language !== "all"
							? "Try adjusting your filters."
							: "Create your first one!"}
					</p>
				</div>
			)}
		</>
	);
}

function SnippetCard({ snippet }: { snippet: (typeof mockSnippets)[0] }) {
	const confirm = useConfirm();
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = async () => {
		// implement copy
	};

	const handleDelete = async () => {
		const shouldDelete = await confirm({
			title: "Delete Snippet",
			description:
				"Are you sure you want to delete this snippet? This action cannot be undone.",
			confirmText: "Delete",
			variant: "destructive",
		});

		if (shouldDelete) {
			// implement delete
		}
	};

	return (
		<Card className="flex flex-col hover:shadow-md transition-shadow group">
			<Link
				to="/snippets/$snippetId"
				params={{ snippetId: snippet.id.toString() }}
				className="flex-1 flex flex-col cursor-pointer"
			>
				<CardHeader className="pb-3">
					<div className="flex justify-between items-start gap-2">
						<CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
							{snippet.title}
						</CardTitle>
						<Badge variant="secondary" className="uppercase text-xs font-bold">
							{snippet.language}
						</Badge>
					</div>
					<CardDescription className="line-clamp-1">
						{snippet.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 pb-3">
					<div className="bg-slate-950 rounded-md p-3 overflow-hidden relative">
						<div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-950/90 pointer-events-none" />
						<pre className="text-slate-50 text-xs font-mono">
							<code>{snippet.code}</code>
						</pre>
					</div>
				</CardContent>
			</Link>
			<CardFooter className="pt-2 flex justify-between border-t bg-muted/20">
				<Button
					variant="ghost"
					size="sm"
					className={
						isCopied
							? "text-green-600"
							: "text-muted-foreground hover:text-foreground"
					}
					onClick={handleCopy}
				>
					{isCopied ? (
						<>
							<Check className="h-4 w-4 mr-2" /> Copied
						</>
					) : (
						<>
							<Copy className="h-4 w-4 mr-2" /> Copy
						</>
					)}
				</Button>
				<div className="flex gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-blue-600"
						asChild
					>
						<Link
							to="/snippets/$snippetId/edit"
							params={{ snippetId: snippet.id.toString() }}
						>
							<Pencil className="h-4 w-4" />
						</Link>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 text-muted-foreground hover:text-red-600"
						onClick={handleDelete}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
