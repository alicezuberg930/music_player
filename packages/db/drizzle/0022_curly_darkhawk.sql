CREATE TABLE `comments` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`content` varchar(255) NOT NULL,
	`parent_comment_id` varchar(36),
	`song_id` varchar(36) NOT NULL,
	`likes` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_parent_comment_id_comments_id_fk` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `comments_user_id_idx` ON `comments` (`user_id`);--> statement-breakpoint
CREATE INDEX `comments_song_id_idx` ON `comments` (`song_id`);--> statement-breakpoint
CREATE INDEX `comments_parent_comment_id_idx` ON `comments` (`parent_comment_id`);