CREATE TABLE `artists_videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artist_id` varchar(36) NOT NULL,
	`video_id` varchar(36) NOT NULL,
	CONSTRAINT `artists_videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`alias` varchar(255) NOT NULL,
	`artist_names` varchar(255) NOT NULL,
	`is_world_wide` boolean DEFAULT false,
	`thumbnail` text NOT NULL,
	`duration` int NOT NULL,
	`is_private` boolean DEFAULT false,
	`release_date` date,
	`distributor` varchar(255),
	`stream` varchar(255),
	`is_indie` boolean DEFAULT false,
	`user_id` varchar(36) NOT NULL,
	`likes` int DEFAULT 0,
	`views` int DEFAULT 0,
	`comments` int DEFAULT 0,
	`size` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `artists_videos` ADD CONSTRAINT `artists_videos_artist_id_artists_id_fk` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artists_videos` ADD CONSTRAINT `artists_videos_video_id_videos_id_fk` FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `videos` ADD CONSTRAINT `videos_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `artist_id_idx` ON `artists_videos` (`artist_id`);--> statement-breakpoint
CREATE INDEX `video_id_idx` ON `artists_videos` (`video_id`);--> statement-breakpoint
CREATE INDEX `songs_user_id_idx` ON `videos` (`user_id`);--> statement-breakpoint
CREATE INDEX `songs_title_idx` ON `videos` (`title`);--> statement-breakpoint
CREATE INDEX `songs_artist_names_idx` ON `videos` (`artist_names`);