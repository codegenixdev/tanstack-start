import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/snippets/$snippetId/edit")({
	component: EditSnippet,
});

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

// Mock Data (In the real app, this comes from the loader based on the ID in the URL)
const existingSnippet = {
	id: "1",
	title: "React UseAuth Hook",
	language: "typescript",
	code: `export const useAuth = () => {\n  const context = useContext(AuthContext);\n  return context;\n};`,
};

export default function EditSnippet() {
	return (
		<div className="min-h-screen bg-muted/40 p-4 md:p-8 font-sans flex items-center justify-center">
			<Card className="w-full max-w-2xl shadow-lg">
				{/* --- HEADER --- */}
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
					<div className="flex flex-col gap-1">
						<CardTitle className="text-2xl font-bold flex items-center gap-2">
							<PencilLine className="h-6 w-6 text-orange-500" />
							Edit Snippet
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Editing{" "}
							<span className="font-semibold text-foreground">
								"{existingSnippet.title}"
							</span>
						</p>
					</div>
					<Button variant="ghost" size="sm" asChild>
						{/* This links back to the specific snippet detail page, not the dashboard */}
						<a href={`/snippets/${existingSnippet.id}`}>
							<ArrowLeft className="mr-1 h-4 w-4" />
							Cancel
						</a>
					</Button>
				</CardHeader>

				{/* --- FORM AREA --- */}
				<CardContent className="pt-6 space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								// KEY DIFFERENCE: Using defaultValue for editing
								defaultValue={existingSnippet.title}
								className="bg-background"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="language">Language</Label>
							{/* Note: Select components usually need a controlled state or a specific default value prop handling depending on the library */}
							<Select defaultValue={existingSnippet.language}>
								<SelectTrigger id="language" className="bg-background">
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
								id="code"
								defaultValue={existingSnippet.code}
								className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50 border-slate-800 focus-visible:ring-orange-500"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-2">
						{/* Hidden input to store the ID is often useful for form submissions */}
						<input type="hidden" name="id" value={existingSnippet.id} />

						<Button type="submit" className="min-w-[150px]">
							<Save className="mr-2 h-4 w-4" />
							Update Changes
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
