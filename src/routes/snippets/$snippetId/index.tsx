import {
	ClientOnly,
	createFileRoute,
	Link,
	useHydrated,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Calendar, Copy, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { mockSnippet } from "@/routes/-lib/mock";

export const Route = createFileRoute("/snippets/$snippetId/")({
	component: SnippetDetail,
});

export default function SnippetDetail() {
	const router = useRouter();
	const navigate = useNavigate();

	const confirm = useConfirm();
	const isHydrated = useHydrated();

	if (!mockSnippet) {
		navigate({ to: "/snippets" });
		return;
	}

	const handleCopy = async () => {
		// implement copy
	};

	const handleDelete = async () => {
		const isConfirmed = await confirm();
		if (!isConfirmed) return;
		// implement delete
		toast.success("Snippet deleted successfully");
		router.navigate({ to: "/snippets" });
		router.invalidate();
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
						<Link to="..">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back
						</Link>
					</Button>
				</div>

				<Card className="shadow-md overflow-hidden">
					<CardHeader className="bg-background border-b pb-6">
						<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<h1 className="text-3xl font-bold text-foreground">
										{mockSnippet.title}
									</h1>
									<Badge
										variant="outline"
										className="text-sm px-3 py-1 uppercase tracking-wide"
									>
										{mockSnippet.language}
									</Badge>
								</div>
								<div className="flex items-center text-sm text-muted-foreground gap-2">
									<Calendar className="h-4 w-4" />
									<span>Created on {mockSnippet.createdAt}</span>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<ClientOnly fallback={<p>Waiting to be hydrated...</p>}>
									<Button variant="outline" size="sm" asChild>
										<Link
											to="/snippets/$snippetId/edit"
											params={{
												snippetId: mockSnippet.id.toString(),
											}}
										>
											<Pencil className="h-4 w-4 mr-2" />
											Edit
										</Link>
									</Button>
								</ClientOnly>
								{isHydrated && (
									<Button
										variant="destructive"
										size="sm"
										onClick={handleDelete}
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete
									</Button>
								)}
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
							<Copy className="h-4 w-4 mr-2" />
						</Button>

						<div className="overflow-x-auto p-6 md:p-8">
							<pre className="text-sm md:text-base font-mono leading-relaxed text-slate-50">
								<code>{mockSnippet.code}</code>
							</pre>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
