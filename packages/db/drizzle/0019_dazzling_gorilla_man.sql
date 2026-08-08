CREATE TABLE IF NOT EXISTS `song_listens` (
	`song_id` varchar(36) NOT NULL,
	`played_at` date NOT NULL,
	`listens` int DEFAULT 0,
	CONSTRAINT `song_listens_song_id_played_at_pk` PRIMARY KEY(`song_id`,`played_at`)
);
--> statement-breakpoint
ALTER TABLE `videos` DROP FOREIGN KEY `videos_user_id_users_id_fk`;--> statement-breakpoint
DROP INDEX `songs_user_id_idx` ON `videos`;--> statement-breakpoint
DROP INDEX `songs_title_idx` ON `videos`;--> statement-breakpoint
DROP INDEX `songs_artist_names_idx` ON `videos`;--> statement-breakpoint
ALTER TABLE `song_listens` ADD CONSTRAINT `song_listens_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `listen_song_id_idx` ON `song_listens` (`song_id`);--> statement-breakpoint
CREATE INDEX `listen_played_at_idx` ON `song_listens` (`played_at`);--> statement-breakpoint
CREATE INDEX `videos_user_id_idx` ON `videos` (`user_id`);--> statement-breakpoint
CREATE INDEX `videos_title_idx` ON `videos` (`title`);--> statement-breakpoint
CREATE INDEX `videos_artist_names_idx` ON `videos` (`artist_names`);--> statement-breakpoint
ALTER TABLE `videos` ADD CONSTRAINT `videos_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;