import { Link } from "@tanstack/react-router";
import { Code2 } from "lucide-react";

export function Navbar() {
	return (
		<nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="mx-auto flex h-14 items-center justify-between">
				<Link to="/" className="flex items-center gap-2 font-bold text-lg">
					<Code2 className="h-5 w-5 text-primary" />
					<span>SnippetBox</span>
				</Link>
			</div>
		</nav>
	);
}
