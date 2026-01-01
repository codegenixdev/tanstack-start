import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Copy, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// 1. Mock Data (To be replaced by DB data later)
const mockSnippets = [
	{
		id: 1,
		title: "React UseAuth Hook",
		language: "typescript",
		description: "A simple custom hook for handling authentication context.",
		code: "export const useAuth = () => {\n  const context = useContext(AuthContext);\n  if (!context) throw new Error('useAuth must be used within AuthProvider');\n  return context;\n};",
	},
	{
		id: 2,
		title: "Centering Div",
		language: "css",
		description: "The classic flexbox centering technique.",
		code: ".center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}",
	},
	{
		id: 3,
		title: "Python API Request",
		language: "python",
		description: "Basic GET request using the requests library.",
		code: "import requests\n\nresponse = requests.get('https://api.example.com/data')\nprint(response.json())",
	},
];

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="min-h-screen bg-muted/40 p-4 md:p-8 font-sans">
			{/* --- HEADER --- */}
			<div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
						<Code2 className="h-8 w-8 text-primary" />
						SnipStack
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage and search your code snippets efficiently.
					</p>
				</div>

				<Button size="lg" className="shadow-sm" asChild>
					<Link to="/create">
						<Plus className="mr-2 h-4 w-4" /> New Snippet
					</Link>
				</Button>
			</div>

			{/* --- FILTERS & SEARCH --- */}
			<div className="max-w-6xl mx-auto mb-8">
				<div className="bg-background rounded-lg border shadow-sm p-4 flex flex-col md:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search by title..."
							className="pl-9 w-full bg-muted/50"
						/>
					</div>
					<div className="w-full md:w-[200px]">
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="All Languages" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Languages</SelectItem>
								<SelectItem value="typescript">TypeScript</SelectItem>
								<SelectItem value="javascript">JavaScript</SelectItem>
								<SelectItem value="python">Python</SelectItem>
								<SelectItem value="css">CSS</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* --- SNIPPET GRID --- */}
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{mockSnippets.map((snippet) => (
					<Card
						key={snippet.id}
						className="flex flex-col hover:shadow-md transition-shadow"
					>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-start gap-2">
								<CardTitle className="text-lg font-semibold truncate">
									{snippet.title}
								</CardTitle>
								<Badge
									variant="secondary"
									className="uppercase text-xs font-bold"
								>
									{snippet.language}
								</Badge>
							</div>
							<CardDescription className="line-clamp-1">
								{snippet.description}
							</CardDescription>
						</CardHeader>

						<CardContent className="flex-1 pb-3">
							<div className="bg-slate-950 rounded-md p-3 overflow-hidden relative group">
								{/* Gradient overlay to indicate there is more code */}
								<div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 pointer-events-none" />
								<pre className="text-slate-50 text-xs font-mono">
									<code>{snippet.code}</code>
								</pre>
							</div>
						</CardContent>

						<CardFooter className="pt-2 flex justify-between border-t bg-muted/20">
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground"
							>
								<Copy className="h-4 w-4 mr-2" /> Copy
							</Button>
							<div className="flex gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-blue-600"
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-red-600"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</CardFooter>
					</Card>
				))}
			</div>

			{/* Empty State Helper (Hidden for now, but good for tutorials) */}
			{mockSnippets.length === 0 && (
				<div className="text-center py-20">
					<p className="text-muted-foreground">
						No snippets found. Create your first one!
					</p>
				</div>
			)}
		</div>
	);
}
