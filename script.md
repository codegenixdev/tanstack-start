npm create @tanstack/start@latest biome, nitro, no demo pages, drizzle & shadcn & query & sqlite

show initial project created by tanstack
then tell them how to clone exact starting branch

# script

```ts src/db/index.ts
export const db = drizzle(getDatabaseUrl(), { schema });
```

```ts src/db/schema.ts
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

```ts src/middleware/logger.ts
import { createMiddleware } from "@tanstack/react-start";

export const loggerMiddleware = createMiddleware().server(
  // depending on state, it might run on client or server
  async ({ next, request }) => {
    const start = Date.now();
    const url = new URL(request.url).pathname;

    console.log(`🟢 [START] ${request.method} ${url}`);

    const result = await next();

    const duration = Date.now() - start;
    console.log(`🟢 [END] ${request.method} ${url} - ${duration}ms`);

    return result;
  }
);
```

```tsx src/routes/hello.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { loggerMiddleware } from "@/middleware/logger";

export const Route = createFileRoute("/hello")({
  server: {
    handlers: ({ createHandlers }) =>
      createHandlers({
        POST: {
          middleware: [loggerMiddleware],
          handler: async ({ request }) => {
            return new Response(`Hello, World! from ${request.url}`);
          },
        },
      }),
  },
  component: HelloPage,
});

function HelloPage() {
  const [reply, setReply] = useState("");

  const handleClick = async () => {
    const res = await fetch("/hello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Tanner" }),
    });
    const data = await res.json();
    setReply(data.message);
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Say Hello
      </button>
      {reply && <p>{reply}</p>}
    </div>
  );
}
```

```ts src/routes/-lib/client-actions.ts
import { createClientOnlyFn } from "@tanstack/react-start";

export const copyToClipboard = createClientOnlyFn(async (text: string) => {
  await navigator.clipboard.writeText(text);
  console.log("🔵 Copied to clipboard!");
  return true;
});
```

```ts src/routes/-lib/utils.ts
import { createIsomorphicFn, createServerOnlyFn } from "@tanstack/react-start";

export const logMessage = createIsomorphicFn()
  .server(() => ({ type: "server", platform: process.platform }))
  .client(() => ({ type: "client", userAgent: navigator.userAgent }));

export const getDatabaseUrl = createServerOnlyFn(() => {
  return process.env.DATABASE_URL!;
});
```

```tsx src/routes/snippets/_filters.index.tsx
	// show that what isomorphic mean
	loader: async ({ context, deps: { search } }) => {
		context.queryClient.prefetchQuery(
			snippetsQueryOptions(search.search, search.language),
		);
	},
	// loaderDeps: ({ search }) => ({ search }),

	return (
		<>
			<div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{snippetsQuery.data.map((snippet) => (
					<SnippetCard key={snippet.id} snippet={snippet} />
				))}
			</div>

			{snippetsQuery.data.length === 0 && (
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



function SnippetCard({ snippet }: { snippet: Snippet }) {
	const deleteSnippetMutation = useDeleteSnippet();


const handleCopy = async () => {
  try {
    await copyToClipboard(snippet.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};


if (shouldDelete) {
  deleteSnippetMutation.mutate(snippet.id);
}

```

```ts src/routes/snippets/-services/mutations.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import { db } from "@/db";
import { snippets, updateSnippetSchema } from "@/db/schema";

export const deleteSnippet = createServerFn({
  method: "POST",
}).handler(async ({ data }) => {
  console.log("data", data);
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
    onError: (error) => {
      console.log(error);
      toast.error("Error updating snippet");
    },
  });
};

const createSnippet = createServerFn({
  method: "POST",
})
  .inputValidator(createSnippetSchema)
  .handler(async ({ data }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
      router.navigate({ to: ".." });
    },
    onError: () => {
      toast.error("Failed to create snippet");
    },
  });
};
```

```tsx src/routes/snippets/create.tsx
export default function CreateSnippet() {
	const mutation = useCreateSnippet();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const data = {
			title: formData.get("title") as string,
			language: formData.get("language") as string,
			code: formData.get("code") as string,
			description: formData.get("description") as string,
		};

		mutation.mutate({ data });
	};


<Button
  type="submit"
  disabled={mutation.isPending}
  className="min-w-[140px]"
>
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

```

```tsx src/routes/snippets/$snippetId/edit.tsx
loader: async ({ params, context }) => {
  await context.queryClient.prefetchQuery(
    getSnippetQueryOptions(params.snippetId),
  );
},

const { snippetId } = Route.useParams();

const { data: snippet } = useSuspenseQuery(getSnippetQueryOptions(snippetId));

const updateMutation = useUpdateSnippet();

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

if (!snippet) {
  // throw notFound();
  return <div className="p-8 text-center">Snippet not found</div>;
}

remove mockSnippet

<Button
  type="submit"
  disabled={updateMutation.isPending}
  className="min-w-[140px]"
>
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

```

```tsx src/routes/snippets/$snippetId/index.tsx
loader: ({ context, params }) => {
  context.queryClient.prefetchQuery(getSnippetQueryOptions(params.snippetId));
};

+ const { snippetId } = Route.useParams();
const router = useRouter();
const navigate = useNavigate();
+ const snippet = useSuspenseQuery(getSnippetQueryOptions(snippetId));
+ const deleteFn = useServerFn(deleteSnippet);

const confirm = useConfirm();
const isHydrated = useHydrated();

if (!snippet.data) {
  navigate({ to: "/snippets" });
  return;
}

const handleCopy = async () => {
  +await copyToClipboard(snippet.data?.code ?? "");
};

const handleDelete = async () => {
  const isConfirmed = await confirm();
  if (!isConfirmed) return;
  + await deleteFn({ data: { id: snippetId } });
  toast.success("Snippet deleted successfully");
  router.navigate({ to: "/snippets" });
  router.invalidate();
};

```

```ts src/routes/snippets/-services/queries.ts
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { snippets } from "@/db/schema";
import { loggerMiddleware } from "@/middleware/logger";

const getSnippets = createServerFn({
  method: "GET",
})
  .middleware([loggerMiddleware])
  .inputValidator((data: { search: string; language: string }) => data)
  .handler(async ({ data }) => {
    const conditions = [];

    if (data?.search?.trim()) {
      const likePattern = `%${data.search.trim()}%`;
      conditions.push(
        or(
          like(snippets.title, likePattern),
          like(snippets.description, likePattern)
        )
      );
    }

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

export const snippetsQueryOptions = (
  search: string = "",
  language: string = "all"
) =>
  queryOptions({
    queryKey: ["snippets", search, language],
    queryFn: () => getSnippets({ data: { search, language } }),
  });

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
