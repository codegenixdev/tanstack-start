# YouTube Tutorial Script: Build a Full-Stack Code Snippet Manager with TanStack Start

## Video Title

"Build a Full-Stack App with TanStack Start - Complete Tutorial (React, TypeScript, SQLite)"

---

## Pre-Recording Checklist

### Environment Setup

- [ ] Node.js 18+ installed
- [ ] VS Code with extensions: ESLint, Prettier, Tailwind CSS IntelliSense
- [ ] Terminal ready
- [ ] Browser DevTools open

### VS Code Snippets to Create (saves typing time)

Create `.vscode/snippets.code-snippets`:

```json
{
  "TanStack Route": {
    "prefix": "tsroute",
    "body": [
      "import { createFileRoute } from '@tanstack/react-router'",
      "",
      "export const Route = createFileRoute('$1')({",
      "  component: $2,",
      "})",
      "",
      "function $2() {",
      "  return <div>$3</div>",
      "}"
    ]
  },
  "Server Function": {
    "prefix": "serverfn",
    "body": [
      "const $1 = createServerFn({",
      "  method: '$2',",
      "}).handler(async ({ data }) => {",
      "  $3",
      "})"
    ]
  }
}
```

---

## VIDEO OUTLINE

### PART 1: Introduction & Project Overview (3-5 min)

**[TALKING HEAD]**

"Hey everyone! Today we're building a full-stack code snippet manager using TanStack Start - the new React framework from the creators of TanStack Router and TanStack Query.

What we'll build:

- Full CRUD operations for code snippets
- Server-side rendering with SQLite database
- Type-safe routing with search params
- Real-time search and filtering
- Copy to clipboard functionality
- Confirmation dialogs

Let's dive in!"

**[SHOW FINISHED APP DEMO - 1 min]**

- Browse snippets page
- Create a snippet
- Edit a snippet
- Delete with confirmation
- Search and filter
- Copy code

---

### PART 2: Project Setup (5-7 min)

**[SCREEN RECORDING]**

```bash
# Step 1: Create the project
npm create @tanstack/start@latest snippet-manager

# Select options:
# - TypeScript: Yes
# - Add TanStack Query: Yes
# - Tailwind CSS: Yes
```

**[EXPLAIN]** "TanStack Start gives us a full-stack React framework with file-based routing, server functions, and seamless integration with TanStack Query."

```bash
cd snippet-manager
npm install
```

**Step 2: Install additional dependencies**

```bash
# Database
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# UI Components (shadcn/ui)
npx shadcn@latest init

# Select: New York style, Slate color, CSS variables: Yes

npx shadcn@latest add button card input label select textarea badge skeleton alert-dialog

# Additional utilities
npm install sonner lucide-react zod class-variance-authority clsx tailwind-merge
```

**Step 3: Project structure overview**

```
src/
├── components/
│   ├── ui/           # shadcn components
│   └── navbar.tsx
├── db/
│   ├── index.ts      # database connection
│   └── schema.ts     # drizzle schema
├── routes/
│   ├── __root.tsx    # root layout
│   ├── index.tsx     # home page
│   └── snippets/     # snippets feature
├── lib/
│   └── utils.ts
└── styles.css
```

---

### PART 3: Database Setup with Drizzle (5-7 min)

**[SCREEN RECORDING]**

**File: `src/db/schema.ts`**

```typescript
import type { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const snippets = sqliteTable("snippets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  language: text("language").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

// Zod schemas for validation
export const createSnippetSchema = createSelectSchema(snippets, {
  createdAt: (schema) => schema.optional(),
  description: (schema) => schema.optional(),
  id: (schema) => schema.optional(),
});

export const updateSnippetSchema = createSelectSchema(snippets, {
  createdAt: (schema) => schema.optional(),
  description: (schema) => schema.optional(),
});

export type Snippet = InferSelectModel<typeof snippets>;
```

**[EXPLAIN]** "Drizzle ORM gives us type-safe database queries. We're using SQLite for simplicity, but you could easily swap to PostgreSQL or MySQL."

**File: `src/db/index.ts`**

```typescript
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
```

**File: `drizzle.config.ts`** (root)

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./sqlite.db",
  },
});
```

**File: `.env`**

```
DATABASE_URL=./sqlite.db
VITE_APP_NAME=SnippetBox
```

**Run migrations:**

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

### PART 4: Root Layout & Navigation (5 min)

**[SCREEN RECORDING]**

**File: `src/components/navbar.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import { Code2 } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Code2 className="h-5 w-5 text-primary" />
          <span>{import.meta.env.VITE_APP_NAME}</span>
        </Link>
      </div>
    </nav>
  );
}
```

**File: `src/routes/__root.tsx`**

```tsx
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "../components/navbar";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SnippetBox" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootLayout,
});

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="max-w-6xl mx-auto py-2 px-4">
          <Toaster />
          <Navbar />
          {children}
          <Scripts />
        </div>
      </body>
    </html>
  );
}
```

**[EXPLAIN]** "The root route wraps our entire app. We're using `createRootRouteWithContext` to pass our QueryClient to all routes."

---

### PART 5: Home Page (3 min)

**[SCREEN RECORDING]**

**File: `src/routes/index.tsx`**

```tsx
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
  component: HomePage,
});

function HomePage() {
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
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Browse Snippets</CardTitle>
                <CardDescription className="mt-2">
                  View and search through all your saved code snippets
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/snippets/create" className="block">
              <CardHeader className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Create Snippet</CardTitle>
                <CardDescription className="mt-2">
                  Add a new code snippet to your collection
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        <Button size="lg" asChild>
          <Link to="/snippets">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
```

---

### PART 6: Server Functions & Queries (8-10 min)

**[SCREEN RECORDING]**

**[EXPLAIN]** "This is where TanStack Start shines! Server functions let us write backend code that runs on the server but is called like a regular function."

**File: `src/routes/snippets/-services/queries.ts`**

```typescript
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { snippets } from "@/db/schema";

// Server function to fetch snippets with filtering
const getSnippets = createServerFn({
  method: "GET",
})
  .inputValidator((data: { search: string; language: string }) => data)
  .handler(async ({ data }) => {
    const conditions = [];

    // Search filter
    if (data?.search?.trim()) {
      const likePattern = `%${data.search.trim()}%`;
      conditions.push(
        or(
          like(snippets.title, likePattern),
          like(snippets.description, likePattern)
        )
      );
    }

    // Language filter
    if (data?.language && data.language !== "all") {
      conditions.push(eq(snippets.language, data.language));
    }

    if (conditions.length === 0) {
      return await db.query.snippets.findMany();
    }

    return await db.query.snippets.findMany({
      where: conditions.length > 1 ? and(...conditions) : conditions[0],
    });
  });

// Query options for TanStack Query
export const snippetsQueryOptions = (search = "", language = "all") =>
  queryOptions({
    queryKey: ["snippets", search, language],
    queryFn: () => getSnippets({ data: { search, language } }),
  });

// Get single snippet
const getSnippet = createServerFn({ method: "GET" })
  .inputValidator((params: { snippetId: string }) => params)
  .handler(async ({ data }) => {
    const snippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, Number(data.snippetId)),
    });
    return snippet ?? null;
  });

export const getSnippetQueryOptions = (snippetId: string) =>
  queryOptions({
    queryKey: ["snippet", snippetId],
    queryFn: () => getSnippet({ data: { snippetId } }),
  });
```

**[EXPLAIN KEY CONCEPTS]**

1. `createServerFn` - Creates a function that runs on the server
2. `inputValidator` - Type-safe input validation
3. `queryOptions` - TanStack Query integration for caching

**File: `src/routes/snippets/-services/mutations.ts`**

```typescript
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "@/db";
import { snippets, updateSnippetSchema } from "@/db/schema";

// Delete snippet
export const deleteSnippet = createServerFn({
  method: "POST",
}).handler(async ({ data }) => {
  await db.delete(snippets).where(eq(snippets.id, data.id));
  return { success: true };
});

export const useDeleteSnippet = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (id: number) => deleteSnippet({ data: { id } }),
    onSuccess: () => {
      toast.success("Snippet deleted successfully");
      router.navigate({ to: "/snippets" });
      router.invalidate();
    },
    onError: () => {
      toast.error("Error deleting snippet");
    },
  });
};

// Update snippet
export const updateSnippet = createServerFn({
  method: "POST",
})
  .inputValidator(updateSnippetSchema)
  .handler(async ({ data }) => {
    await db.update(snippets).set(data).where(eq(snippets.id, data.id));
    return { success: true };
  });

export const useUpdateSnippet = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: typeof updateSnippetSchema.shape) => updateSnippet(data),
    onSuccess: () => {
      toast.success("Snippet updated successfully");
      router.invalidate();
    },
    onError: () => {
      toast.error("Error updating snippet");
    },
  });
};
```

---

### PART 7: Snippets List with Search & Filter (10-12 min)

**[SCREEN RECORDING]**

**[EXPLAIN]** "Now we'll create a layout route with search params. TanStack Router has amazing type-safe search param handling."

**File: `src/routes/snippets/-types/searchSchema.ts`**

```typescript
import { z } from "zod";

export const snippetSearchSchema = z.object({
  search: z.string().default("").catch(""),
  language: z.string().default("all").catch("all"),
});
```

**File: `src/routes/snippets/_filters.tsx`** (Layout Route)

```tsx
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
import { snippetSearchSchema } from "./-types/searchSchema";

export const Route = createFileRoute("/snippets/_filters")({
  component: FiltersLayout,
  validateSearch: snippetSearchSchema,
});

function FiltersLayout() {
  const { search, language } = Route.useSearch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(search);

  // Sync input with URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        navigate({ search: { search: searchInput, language } });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, language, navigate, search]);

  const handleLanguageChange = (value: string) => {
    navigate({ search: { search, language: value } });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Snippets</h1>
          <p className="text-muted-foreground mt-1">
            Manage and search your code snippets efficiently.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link to="/snippets/create">
            <Plus className="mr-2 h-4 w-4" /> New Snippet
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="mx-auto mb-8">
        <div className="bg-background rounded-lg border shadow-sm p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or description..."
              className="pl-9 w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full md:w-[200px]">
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

      {/* Child routes render here */}
      <Outlet />
    </div>
  );
}
```

**[EXPLAIN]** "The underscore prefix `_filters` makes this a layout route - it wraps child routes but doesn't add to the URL path."

**File: `src/routes/snippets/_filters.index.tsx`**

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
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
import type { Snippet } from "@/db/schema";
import { useDeleteSnippet } from "./-services/mutations";
import { snippetsQueryOptions } from "./-services/queries";

export const Route = createFileRoute("/snippets/_filters/")({
  component: SnippetsList,
  loader: async ({ context, deps: { search } }) => {
    context.queryClient.prefetchQuery(
      snippetsQueryOptions(search.search, search.language)
    );
  },
});

function SnippetsList() {
  const { search, language } = Route.useSearch();
  const { data: snippets } = useSuspenseQuery(
    snippetsQueryOptions(search, language)
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>

      {snippets.length === 0 && (
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

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const deleteMutation = useDeleteSnippet();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
            <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
              {snippet.title}
            </CardTitle>
            <Badge variant="secondary" className="uppercase text-xs">
              {snippet.language}
            </Badge>
          </div>
          <CardDescription className="line-clamp-1">
            {snippet.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-3">
          <div className="bg-slate-950 rounded-md p-3 overflow-hidden relative">
            <pre className="text-slate-50 text-xs font-mono">
              <code>{snippet.code}</code>
            </pre>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="pt-2 flex justify-between border-t">
        <Button
          variant="ghost"
          size="sm"
          className={isCopied ? "text-green-600" : "text-muted-foreground"}
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
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
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
            className="h-8 w-8 hover:text-red-600"
            onClick={() => deleteMutation.mutate(snippet.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
```

---

### PART 8: Create Snippet Page (5-7 min)

**[SCREEN RECORDING]**

**File: `src/routes/snippets/create.tsx`**

```tsx
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
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
import { db } from "@/db";
import { createSnippetSchema, snippets } from "@/db/schema";

// Server function to create snippet
const createSnippet = createServerFn({
  method: "POST",
})
  .inputValidator(createSnippetSchema)
  .handler(async ({ data }) => {
    await db.insert(snippets).values(data);
    return { success: true };
  });

const useCreateSnippet = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      toast.success("Snippet created successfully");
      router.invalidate();
      router.navigate({ to: "/snippets" });
    },
    onError: () => {
      toast.error("Failed to create snippet");
    },
  });
};

export const Route = createFileRoute("/snippets/create")({
  component: CreateSnippet,
});

function CreateSnippet() {
  const mutation = useCreateSnippet();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    mutation.mutate({
      data: {
        title: formData.get("title") as string,
        language: formData.get("language") as string,
        code: formData.get("code") as string,
        description: formData.get("description") as string,
      },
    });
  };

  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b">
          <div>
            <CardTitle className="text-2xl font-bold">
              Create New Snippet
            </CardTitle>
            <CardDescription className="mt-1">
              Save a reusable code snippet to your library.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/snippets">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  name="title"
                  placeholder="e.g., React Auth Hook"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select name="language" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
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
              <Textarea
                name="code"
                placeholder="// Paste or write your code here..."
                className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                name="description"
                placeholder="Briefly describe what this snippet does..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="ghost" asChild>
                <Link to="/snippets">Cancel</Link>
              </Button>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Snippet
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### PART 9: Snippet Detail Page (5 min)

**[SCREEN RECORDING]**

**File: `src/routes/snippets/$snippetId/index.tsx`**

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Copy, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDeleteSnippet } from "../-services/mutations";
import { getSnippetQueryOptions } from "../-services/queries";

export const Route = createFileRoute("/snippets/$snippetId/")({
  component: SnippetDetail,
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(getSnippetQueryOptions(params.snippetId));
  },
});

function SnippetDetail() {
  const { snippetId } = Route.useParams();
  const navigate = useNavigate();
  const { data: snippet } = useSuspenseQuery(getSnippetQueryOptions(snippetId));
  const deleteMutation = useDeleteSnippet();

  if (!snippet) {
    navigate({ to: "/snippets" });
    return null;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/snippets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <Card className="shadow-md overflow-hidden">
          <CardHeader className="border-b pb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{snippet.title}</h1>
                  <Badge variant="outline" className="uppercase">
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
                    params={{ snippetId: snippet.id.toString() }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(snippet.id)}
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
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>

            <div className="overflow-x-auto p-6 md:p-8">
              <pre className="text-sm md:text-base font-mono text-slate-50">
                <code>{snippet.code}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

### PART 10: Edit Snippet Page (5 min)

**[SCREEN RECORDING]**

**File: `src/routes/snippets/$snippetId/edit.tsx`**

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, PencilLine, Save } from "lucide-react";
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
import { useUpdateSnippet } from "../-services/mutations";
import { getSnippetQueryOptions } from "../-services/queries";

export const Route = createFileRoute("/snippets/$snippetId/edit")({
  component: EditSnippet,
  loader: async ({ params, context }) => {
    await context.queryClient.prefetchQuery(
      getSnippetQueryOptions(params.snippetId)
    );
  },
});

function EditSnippet() {
  const { snippetId } = Route.useParams();
  const { data: snippet } = useSuspenseQuery(getSnippetQueryOptions(snippetId));
  const updateMutation = useUpdateSnippet();

  if (!snippet) {
    return <div className="p-8 text-center">Snippet not found</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    updateMutation.mutate({
      data: {
        id: Number(snippetId),
        title: formData.get("title") as string,
        language: formData.get("language") as string,
        code: formData.get("code") as string,
        description: formData.get("description") as string,
      },
    });
  };

  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-6 border-b">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <PencilLine className="h-6 w-6 text-orange-500" />
              Edit Snippet
            </CardTitle>
            <CardDescription className="mt-1">
              Editing "{snippet.title}"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input name="title" defaultValue={snippet.title} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  name="language"
                  defaultValue={snippet.language}
                  required
                >
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Textarea
                name="code"
                defaultValue={snippet.code}
                required
                className="min-h-[300px] font-mono text-sm bg-slate-950 text-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                name="description"
                defaultValue={snippet.description || ""}
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="ghost" asChild>
                <Link to="/snippets/$snippetId" params={{ snippetId }}>
                  Cancel
                </Link>
              </Button>

              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### PART 11: Bonus - Confirmation Dialog & Toast (5 min)

**[SCREEN RECORDING]**

**File: `src/components/ui/confirm-dialog.tsx`**

```tsx
import { createContext, type ReactNode, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
};

type ConfirmContextType = (options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null
  );

  const confirm = (opts?: ConfirmOptions) => {
    setOptions({
      title: "Are you sure?",
      description: "This action cannot be undone.",
      confirmText: "Continue",
      cancelText: "Cancel",
      variant: "default",
      ...opts,
    });
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    if (resolver) resolver(true);
    setOpen(false);
  };

  const handleCancel = () => {
    if (resolver) resolver(false);
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {options.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                options.variant === "destructive"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}
```

**Usage example:**

```tsx
const confirm = useConfirm();

const handleDelete = async () => {
  const shouldDelete = await confirm({
    title: "Delete Snippet",
    description: "Are you sure? This action cannot be undone.",
    confirmText: "Delete",
    variant: "destructive",
  });

  if (shouldDelete) {
    deleteMutation.mutate(snippet.id);
  }
};
```

---

### PART 12: Wrap Up & Next Steps (3 min)

**[TALKING HEAD]**

"And that's it! We've built a complete full-stack application with:

✅ TanStack Start for the framework
✅ TanStack Router for type-safe routing
✅ TanStack Query for data fetching and caching
✅ Server functions for backend logic
✅ Drizzle ORM with SQLite
✅ shadcn/ui for beautiful components
✅ Full CRUD operations

**What you could add next:**

- Authentication with Clerk or Auth.js
- Syntax highlighting with Prism or Shiki
- Tags/categories for snippets
- Export/import functionality
- Dark mode toggle

Thanks for watching! Don't forget to like, subscribe, and drop any questions in the comments.

**Links in description:**

- GitHub repo
- TanStack Start docs
- Drizzle ORM docs"

---

## Quick Reference Commands

```bash
# Development
npm run dev

# Database
npx drizzle-kit generate
npx drizzle-kit migrate
npx drizzle-kit studio  # GUI for database

# Build
npm run build
npm run start
```

---

## Timestamps for Video Description

```
0:00 - Introduction & Demo
3:00 - Project Setup
8:00 - Database Setup with Drizzle
15:00 - Root Layout & Navigation
20:00 - Home Page
23:00 - Server Functions & Queries
33:00 - Snippets List with Search
45:00 - Create Snippet Page
52:00 - Snippet Detail Page
57:00 - Edit Snippet Page
1:02:00 - Confirmation Dialog
1:07:00 - Wrap Up & Next Steps
```
