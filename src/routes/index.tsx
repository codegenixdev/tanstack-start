import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "SnippetBox - Manage Your Code Snippets" },
			{
				name: "description",
				content: "A simple code snippet manager built with TanStack Start",
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-2xl w-full text-center space-y-8">
				<div>
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
						<Code2 className="w-8 h-8 text-primary" />
					</div>
					<h1 className="text-4xl font-bold tracking-tight mb-2">
						Snippet Manager
					</h1>
					<p className="text-muted-foreground text-lg">
						Store, organize, and manage your code snippets efficiently
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-4">
					<Card className="hover:shadow-lg transition-shadow cursor-pointer group">
						<Link to="/snippets" className="block">
							<CardHeader className="text-center py-8">
								<div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<CardTitle className="text-xl">Browse Snippets</CardTitle>
								<CardDescription className="mt-2">
									View and search through all your saved code snippets
								</CardDescription>
							</CardHeader>
						</Link>
					</Card>

					<Card className="hover:shadow-lg transition-shadow cursor-pointer group">
						<Link to="/snippets/create" className="block">
							<CardHeader className="text-center py-8">
								<div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
								<CardTitle className="text-xl">Create Snippet</CardTitle>
								<CardDescription className="mt-2">
									Add a new code snippet to your collection
								</CardDescription>
							</CardHeader>
						</Link>
					</Card>
				</div>

				<div className="pt-4">
					<Button size="lg" asChild>
						<Link to="/snippets">Get Started</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
