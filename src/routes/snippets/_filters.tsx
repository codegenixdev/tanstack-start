import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { snippetSearchSchema } from "@/routes/snippets/-types/searchSchema";

export const Route = createFileRoute("/snippets/_filters")({
	component: Filters,
	validateSearch: snippetSearchSchema,
});

function Filters() {
	const { search, language } = Route.useSearch();
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState(search);

	useEffect(() => {
		setSearchInput(search);
	}, [search]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (searchInput !== search) {
				navigate({
					search: { search: searchInput, language },
				});
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [searchInput, language, navigate, search]);

	const handleLanguageChange = (value: string) => {
		navigate({
			search: { search, language: value },
		});
	};

	return (
		<div className="min-h-screen p-4 md:p-8 font-sans">
			<div className="mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
						Snippets
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage and search your code snippets efficiently.
					</p>
				</div>
				<Button size="lg" className="shadow-sm" asChild>
					<Link to="/snippets/create">
						<Plus className="mr-2 h-4 w-4" /> New Snippet
					</Link>
				</Button>
			</div>

			<div className="mx-auto mb-8">
				<div className="bg-background rounded-lg border shadow-sm p-4 flex flex-col md:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search by title or description..."
							className="pl-9 w-full bg-muted/50"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
					</div>
					<div className="w-full md:w-[200px]">
						<Select value={language} onValueChange={handleLanguageChange}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="All Languages" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Languages</SelectItem>
								<SelectItem value="typescript">TypeScript</SelectItem>
								<SelectItem value="javascript">JavaScript</SelectItem>
								<SelectItem value="python">Python</SelectItem>
								<SelectItem value="css">CSS</SelectItem>
								<SelectItem value="sql">SQL</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<Outlet />
		</div>
	);
}
