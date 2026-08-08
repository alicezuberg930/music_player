CREATE TABLE `chats` (
	`id` varchar(36) NOT NULL,
	`from_user_id` varchar(36) NOT NULL,
	`to_user_id` varchar(36) NOT NULL,
	`content` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_from_user_id_users_id_fk` FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_to_user_id_users_id_fk` FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `chats_from_user_id_idx` ON `chats` (`from_user_id`);--> statement-breakpoint
CREATE INDEX `chats_to_user_id_idx` ON `chats` (`to_user_id`);