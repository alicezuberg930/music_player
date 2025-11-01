CREATE TABLE `artists` (
	`id` int AUTO_INCREMENT NOT NULL,
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
	`artist_id` int,
	`song_id` int,
	CONSTRAINT `artists_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
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
CREATE TABLE `songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`alias` varchar(255) NOT NULL,
	`artist_names` varchar(255) NOT NULL,
	`is_world_wide` boolean DEFAULT false,
	`thumbnail` text NOT NULL,
	`lyrics_file` text,
	`duration` int NOT NULL,
	`is_private` boolean DEFAULT false,
	`release_date` date,
	`distributor` varchar(255),
	`stream` varchar(255),
	`is_indie` boolean DEFAULT false,
	`mvlink` varchar(500),
	`has_lyrics` boolean DEFAULT false,
	`user_id` int,
	`likes` int DEFAULT 0,
	`listens` int DEFAULT 0,
	`liked` boolean DEFAULT false,
	`comments` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlist_artists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playlist_id` int,
	`artist_id` int,
	CONSTRAINT `playlist_artists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlist_songs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playlist_id` int,
	`song_id` int,
	CONSTRAINT `playlist_songs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`artist_names` varchar(255) NOT NULL,
	`is_world_wide` boolean DEFAULT false,
	`thumbnail` text NOT NULL,
	`is_private` boolean DEFAULT false,
	`release_date` date,
	`description` text,
	`is_indie` boolean DEFAULT false,
	`user_id` int,
	`total_duration` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`listens` int DEFAULT 0,
	`liked` boolean DEFAULT false,
	`comments` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `playlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `artists_songs` ADD CONSTRAINT `artists_songs_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artists_songs` ADD CONSTRAINT `artists_songs_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `songs` ADD CONSTRAINT `songs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_artists` ADD CONSTRAINT `playlist_artists_playlist_id_playlists_id_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_artists` ADD CONSTRAINT `playlist_artists_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_playlist_id_playlists_id_fk` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlist_songs` ADD CONSTRAINT `playlist_songs_song_id_songs_id_fk` FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlists` ADD CONSTRAINT `playlists_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `artist_id_idx` ON `artists_songs` (`artist_id`);--> statement-breakpoint
CREATE INDEX `song_id_idx` ON `artists_songs` (`song_id`);--> statement-breakpoint
CREATE INDEX `songs_user_id_idx` ON `songs` (`user_id`);--> statement-breakpoint
CREATE INDEX `songs_title_idx` ON `songs` (`title`);--> statement-breakpoint
CREATE INDEX `playlist_id_idx` ON `playlist_artists` (`playlist_id`);--> statement-breakpoint
CREATE INDEX `artist_id_idx` ON `playlist_artists` (`artist_id`);--> statement-breakpoint
CREATE INDEX `playlist_id_idx` ON `playlist_songs` (`playlist_id`);--> statement-breakpoint
CREATE INDEX `song_id_idx` ON `playlist_songs` (`song_id`);--> statement-breakpoint
CREATE INDEX `playlists_user_id_idx` ON `playlists` (`user_id`);--> statement-breakpoint
CREATE INDEX `playlists_title_idx` ON `playlists` (`title`);