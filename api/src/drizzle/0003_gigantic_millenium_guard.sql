CREATE TABLE `user_favorite_playlists` (
	`user_id` varchar(36) NOT NULL,
	`playlist_id` varchar(36) NOT NULL,
	CONSTRAINT `user_favorite_playlists_user_id_playlist_id_pk` PRIMARY KEY(`user_id`,`playlist_id`)
);
--> statement-breakpoint
CREATE TABLE `user_favorite_songs` (
	`user_id` varchar(36) NOT NULL,
	`song_id` varchar(36) NOT NULL,
	CONSTRAINT `user_favorite_songs_user_id_song_id_pk` PRIMARY KEY(`user_id`,`song_id`)
);
--> statement-breakpoint
ALTER TABLE `songs` MODIFY COLUMN `release_date` date DEFAULT '2025-12-08';--> statement-breakpoint
ALTER TABLE `user_favorite_playlists` ADD CONSTRAINT `user_favorite_playlists_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorite_playlists` ADD CONSTRAINT `user_favorite_playlists_playlist_id_playlists_id_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorite_songs` ADD CONSTRAINT `user_favorite_songs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorite_songs` ADD CONSTRAINT `user_favorite_songs_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_favorite_playlists` (`user_id`);--> statement-breakpoint
CREATE INDEX `playlist_id_idx` ON `user_favorite_playlists` (`playlist_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `user_favorite_songs` (`user_id`);--> statement-breakpoint
CREATE INDEX `song_id_idx` ON `user_favorite_songs` (`song_id`);