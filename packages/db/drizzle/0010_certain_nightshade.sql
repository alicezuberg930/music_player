ALTER TABLE `users` ADD `provider` enum('local','facebook','google') DEFAULT 'local' NOT NULL;--> statement-breakpoint
CREATE INDEX `songs_artist_names_idx` ON `songs` (`artist_names`);