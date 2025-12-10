CREATE TABLE `banners` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255),
	`thumbnail` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `songs` MODIFY COLUMN `release_date` date DEFAULT '2025-12-09';