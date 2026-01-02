CREATE TABLE `snippets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`language` text NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT '2026-01-01T12:05:35.095Z' NOT NULL
);
