CREATE TABLE `notifications` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`time` timestamp NOT NULL DEFAULT (now()),
	`is_read` boolean NOT NULL DEFAULT false,
	`to_user_id` varchar(36) NOT NULL,
	`unique_key` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_notifications` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`end_point` text NOT NULL,
	`p256dh` varchar(255) NOT NULL,
	`auth` varchar(255) NOT NULL,
	`ip` varchar(45),
	`created_date` timestamp NOT NULL DEFAULT (now()),
	`token` varchar(255) NOT NULL,
	CONSTRAINT `push_notifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `push_notifications_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_to_user_id_users_id_fk` FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `push_notifications` ADD CONSTRAINT `push_notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `notifications_to_user_id_idx` ON `notifications` (`to_user_id`);--> statement-breakpoint
CREATE INDEX `notifications_unique_key_idx` ON `notifications` (`unique_key`);--> statement-breakpoint
CREATE INDEX `push_notifications_user_id_idx` ON `push_notifications` (`user_id`);