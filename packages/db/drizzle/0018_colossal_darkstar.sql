ALTER TABLE `push_notifications` RENAME COLUMN `device` TO `device_type`;--> statement-breakpoint
ALTER TABLE `push_notifications` ADD `device_vendor` varchar(255);--> statement-breakpoint
ALTER TABLE `push_notifications` ADD `device_model` varchar(255);