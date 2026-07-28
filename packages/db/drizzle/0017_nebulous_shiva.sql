ALTER TABLE `push_notifications` RENAME COLUMN `token` TO `browser`;--> statement-breakpoint
ALTER TABLE `push_notifications` DROP INDEX `push_notifications_token_unique`;--> statement-breakpoint
ALTER TABLE `push_notifications` MODIFY COLUMN `browser` varchar(255);--> statement-breakpoint
ALTER TABLE `push_notifications` ADD `device` varchar(255);--> statement-breakpoint
ALTER TABLE `push_notifications` ADD `cpu` varchar(255);--> statement-breakpoint
ALTER TABLE `push_notifications` ADD `os` varchar(255);