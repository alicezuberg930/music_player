ALTER TABLE `playlist_artists` DROP FOREIGN KEY `playlist_artists_artist_id_artists_id_fk`;
--> statement-breakpoint
ALTER TABLE `songs` MODIFY COLUMN `release_date` date DEFAULT '2025-12-03';--> statement-breakpoint
ALTER TABLE `playlist_artists` MODIFY COLUMN `artist_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `verify_token` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `reset_password_token` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `reset_password_expires` timestamp;--> statement-breakpoint
ALTER TABLE `playlist_artists` ADD CONSTRAINT `playlist_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE restrict ON UPDATE no action;