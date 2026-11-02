CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`desired_location` text,
	`budget` text,
	`property_type` text,
	`stage` text DEFAULT 'new' NOT NULL,
	`follow_up` text,
	`diaspora` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`title` text NOT NULL,
	`location` text NOT NULL,
	`type` text NOT NULL,
	`price` integer NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`description` text NOT NULL,
	`image_key` text,
	`featured` integer DEFAULT false NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `properties_reference_unique` ON `properties` (`reference`);