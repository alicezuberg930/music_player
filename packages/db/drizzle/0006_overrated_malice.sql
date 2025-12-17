CREATE TABLE `logs` (
	`id` varchar(36) NOT NULL,
	`message` text,
	`environment` enum('production','development') NOT NULL,
	`level` enum('info','warning','error') NOT NULL,
	`ip_address` varchar(45),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `songs` MODIFY COLUMN `release_date` date;