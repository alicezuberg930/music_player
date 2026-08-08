CREATE TABLE `search_terms` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`content` varchar(255) NOT NULL,
	`count` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_terms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `search_terms` ADD CONSTRAINT `search_terms_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `content_idx` ON `search_terms` (`content`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `search_terms` (`user_id`);