import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PencilLine, Save } from "lucide-react";
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
import { mockSnippet } from "@/routes/-lib/mock";

export const Route = createFileRoute("/snippets/$snippetId/edit")({
	component: EditSnippet,
});

export default function EditSnippet() {
	const { snippetId } = Route.useParams();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// const formData = new FormData(e.currentTarget);
		// implement updating
	};

	if (!mockSnippet) {
		// throw notFound();
		return <div className="p-8 text-center">Snippet not found</div>;
	}

	return (
		<div className="p-4 md:p-8 font-sans flex items-center justify-center min-h-screen bg-background">
			<Card className="w-full max-w-3xl shadow-xl">
				<CardHeader className="flex flex-row items-center justify-between pb-6 border-b">
					<div>
						<CardTitle className="text-2xl font-bold flex items-center gap-3">
							<PencilLine className="h-6 w-6 text-orange-500" />
							Edit Snippet
						</CardTitle>
						<CardDescription className="mt-1">
							Editing{" "}
							<span className="font-semibold">"{mockSnippet.title}"</span>
						</CardDescription>
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link to="/snippets/$snippetId" params={{ snippetId }}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Cancel
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
									defaultValue={mockSnippet.title}
									required
									className="bg-background"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="language">Language</Label>
								<Select
									name="language"
									defaultValue={mockSnippet.language}
									required
								>
									<SelectTrigger name="language">
										<SelectValue />
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
								defaultValue={mockSnippet.code}
								required
								className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50 resize-y focus-visible:ring-orange-500"
								placeholder="// Your code here..."
							/>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Description (optional)</Label>
							<Input
								name="description"
								defaultValue={mockSnippet.description || ""}
								placeholder="Briefly describe what this snippet does..."
								className="bg-background"
							/>
						</div>

						{/* Actions */}
						<div className="flex justify-end gap-4 pt-6 border-t">
							<Button type="button" variant="ghost" asChild>
								<Link to="/snippets/$snippetId" params={{ snippetId }}>
									Cancel
								</Link>
							</Button>

							<Button type="submit" className="min-w-[140px]">
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
