import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Save, X } from "lucide-react";
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

export const Route = createFileRoute("/create")({ component: CreateSnippet });

export default function CreateSnippet() {
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
						<Link to="/">
							<ChevronLeft className="mr-1 h-4 w-4" />
							Back
						</Link>
					</Button>
				</CardHeader>

				<CardContent className="pt-6 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								placeholder="e.g., React Auth Hook"
								className="bg-background"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="language">Language</Label>
							<Select>
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
								placeholder="// Paste your code here..."
								className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50 border-slate-800 placeholder:text-slate-500 resize-y"
							/>
							<div className="absolute bottom-2 right-2 text-xs text-slate-500 pointer-events-none">
								Markdown supported
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<Button variant="ghost" type="button" asChild>
							<Link to="..">Cancel</Link>
						</Button>
						<Button type="submit" className="min-w-[120px]">
							<Save className="mr-2 h-4 w-4" />
							Save Snippet
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
