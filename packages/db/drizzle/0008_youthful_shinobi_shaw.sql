CREATE TABLE `artist_followers` (
	`artist_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `artist_followers_artist_id_user_id_pk` PRIMARY KEY(`artist_id`,`user_id`)
);
--> statement-breakpoint
ALTER TABLE `artist_followers` ADD CONSTRAINT `artist_followers_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artist_followers` ADD CONSTRAINT `artist_followers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `artist_id_idx` ON `artist_followers` (`artist_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `artist_followers` (`user_id`);