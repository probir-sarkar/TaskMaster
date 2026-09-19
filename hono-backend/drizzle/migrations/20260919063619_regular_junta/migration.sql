CREATE TABLE `additional_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`password` text,
	`user_id` integer NOT NULL,
	`signup_method` text DEFAULT 'EMAIL',
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_additional_info_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY,
	`title` text NOT NULL,
	`content` text,
	`status` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	`deadline` integer,
	`user_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT `fk_tasks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`email` text NOT NULL,
	`name` text,
	`photo` text,
	`created_at` integer NOT NULL,
	`role` text DEFAULT 'USER',
	`status` text DEFAULT 'ACTIVE'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `additional_info_user_id_idx` ON `additional_info` (`user_id`);--> statement-breakpoint
CREATE INDEX `tasks_user_id_idx` ON `tasks` (`user_id`);--> statement-breakpoint
CREATE INDEX `tasks_status_position_idx` ON `tasks` (`status`,`position`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);