ALTER TABLE `artists_songs` DROP FOREIGN KEY `artists_songs_artist_id_artists_id_fk`;
--> statement-breakpoint
ALTER TABLE `playlist_artists` DROP FOREIGN KEY `playlist_artists_artist_id_artists_id_fk`;
--> statement-breakpoint
ALTER TABLE `artists_songs` ADD CONSTRAINT `artists_songs_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_artists` ADD CONSTRAINT `playlist_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE cascade ON UPDATE no action;