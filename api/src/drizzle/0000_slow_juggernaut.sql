CREATE TABLE `artists` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`spotlight` boolean DEFAULT false,
	`alias` varchar(255),
	`thumbnail` text,
	`total_follow` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `artists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `artists_songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artist_id` varchar(36) NOT NULL,
	`song_id` varchar(36) NOT NULL,
	CONSTRAINT `artists_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `genres` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`alias` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `genres_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`fullname` varchar(100) NOT NULL,
	`phone` varchar(20),
	`avatar` varchar(255),
	`birthday` date,
	`email` varchar(100) NOT NULL,
	`password` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `song_genres` (
	`id` int AUTO_INCREMENT NOT NULL,
	`genre_id` varchar(36) NOT NULL,
	`song_id` varchar(36) NOT NULL,
	CONSTRAINT `song_genres_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `songs` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`alias` varchar(255) NOT NULL,
	`artist_names` varchar(255) NOT NULL,
	`is_world_wide` boolean DEFAULT false,
	`thumbnail` text NOT NULL,
	`lyrics_file` text,
	`duration` int NOT NULL,
	`is_private` boolean DEFAULT false,
	`release_date` date DEFAULT '2025-11-21',
	`distributor` varchar(255),
	`stream` varchar(255),
	`is_indie` boolean DEFAULT false,
	`mvlink` varchar(500),
	`has_lyrics` boolean DEFAULT false,
	`user_id` varchar(36) NOT NULL,
	`likes` int DEFAULT 0,
	`listens` int DEFAULT 0,
	`liked` boolean DEFAULT false,
	`comments` int DEFAULT 0,
	`size` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlist_artists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playlist_id` varchar(36) NOT NULL,
	`artist_id` varchar(36),
	CONSTRAINT `playlist_artists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlist_songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playlist_id` varchar(36) NOT NULL,
	`song_id` varchar(36) NOT NULL,
	CONSTRAINT `playlist_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`artist_names` varchar(255) NOT NULL,
	`is_world_wide` boolean DEFAULT false,
	`thumbnail` text NOT NULL,
	`is_private` boolean DEFAULT false,
	`release_date` date,
	`description` text,
	`is_indie` boolean DEFAULT false,
	`user_id` varchar(36) NOT NULL,
	`total_duration` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`listens` int DEFAULT 0,
	`liked` boolean DEFAULT false,
	`comments` int DEFAULT 0,
	`is_album` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `playlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `artists_songs` ADD CONSTRAINT `artists_songs_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artists_songs` ADD CONSTRAINT `artists_songs_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `song_genres` ADD CONSTRAINT `song_genres_genre_id_genres_id_fk` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `song_genres` ADD CONSTRAINT `song_genres_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `songs` ADD CONSTRAINT `songs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_artists` ADD CONSTRAINT `playlist_artists_playlist_id_playlists_id_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_artists` ADD CONSTRAINT `playlist_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_playlist_id_playlists_id_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlists` ADD CONSTRAINT `playlists_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `artist_id_idx` ON `artists_songs` (`artist_id`);--> statement-breakpoint
CREATE INDEX `song_id_idx` ON `artists_songs` (`song_id`);--> statement-breakpoint
CREATE INDEX `genre_id_idx` ON `song_genres` (`genre_id`);--> statement-breakpoint
CREATE INDEX `song_id_idx` ON `song_genres` (`song_id`);--> statement-breakpoint
CREATE INDEX `songs_user_id_idx` ON `songs` (`user_id`);--> statement-breakpoint
CREATE INDEX `songs_title_idx` ON `songs` (`title`);--> statement-breakpoint
CREATE INDEX `playlist_id_idx` ON `playlist_artists` (`playlist_id`);--> statement-breakpoint
CREATE INDEX `artist_id_idx` ON `playlist_artists` (`artist_id`);--> statement-breakpoint
CREATE INDEX `playlist_id_idx` ON `playlist_songs` (`playlist_id`);--> statement-breakpoint
CREATE INDEX `song_id_idx` ON `playlist_songs` (`song_id`);--> statement-breakpoint
CREATE INDEX `playlists_user_id_idx` ON `playlists` (`user_id`);--> statement-breakpoint
CREATE INDEX `playlists_title_idx` ON `playlists` (`title`);