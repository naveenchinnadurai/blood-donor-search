CREATE TYPE "public"."blood_groups" AS ENUM('All', 'A+ve', 'B+ve', 'O+ve', 'AB+ve', 'A-ve', 'B-ve', 'O-ve', 'AB-ve');--> statement-breakpoint
CREATE TYPE "public"."donation_type" AS ENUM('Both', 'Blood', 'Organ');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "donors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"mobile_number" text,
	"joined_at" timestamp DEFAULT '2024-11-16 19:00:14.357',
	"location" text NOT NULL,
	"blood_group" "blood_groups" NOT NULL,
	"donation_type" "donation_type" NOT NULL,
	CONSTRAINT "donors_email_unique" UNIQUE("email"),
	CONSTRAINT "donors_mobile_number_unique" UNIQUE("mobile_number")
);
