CREATE TABLE `chats` (
	`id` varchar(36) NOT NULL,
	`from_user_id` varchar(36) NOT NULL,
	`to_user_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`content` text NOT NULL,
	`parent_comment_id` varchar(36),
	`song_id` varchar(36) NOT NULL,
	`likes` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_terms` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`content` text NOT NULL,
	`count` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_terms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_from_user_id_users_id_fk` FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chats` ADD CONSTRAINT `chats_to_user_id_users_id_fk` FOREIGN KEY (`to_user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_parent_comment_id_comments_id_fk` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `search_terms` ADD CONSTRAINT `search_terms_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `chats_from_user_id_idx` ON `chats` (`from_user_id`);--> statement-breakpoint
CREATE INDEX `chats_to_user_id_idx` ON `chats` (`to_user_id`);--> statement-breakpoint
CREATE INDEX `comments_user_id_idx` ON `comments` (`user_id`);--> statement-breakpoint
CREATE INDEX `comments_song_id_idx` ON `comments` (`song_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_comment_id_idx` ON `comments` (`parent_comment_id`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `search_terms` (`user_id`);