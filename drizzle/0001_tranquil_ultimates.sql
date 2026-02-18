PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_snippets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`language` text NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT '2026-02-18T17:32:59.277Z' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_snippets`("id", "title", "language", "code", "description", "created_at") SELECT "id", "title", "language", "code", "description", "created_at" FROM `snippets`;--> statement-breakpoint
DROP TABLE `snippets`;--> statement-breakpoint
ALTER TABLE `__new_snippets` RENAME TO `snippets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;