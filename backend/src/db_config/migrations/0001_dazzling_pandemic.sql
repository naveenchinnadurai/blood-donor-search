ALTER TABLE "users" RENAME TO "donors";--> statement-breakpoint
ALTER TABLE "donors" DROP CONSTRAINT "users_name_unique";--> statement-breakpoint
ALTER TABLE "donors" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "donors" ALTER COLUMN "joined_at" SET DEFAULT '2024-11-11 19:10:25.789';--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "location" text NOT NULL;--> statement-breakpoint
ALTER TABLE "donors" ADD COLUMN "blood_group" text NOT NULL;--> statement-breakpoint
ALTER TABLE "donors" ADD CONSTRAINT "donors_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "donors" ADD CONSTRAINT "donors_email_unique" UNIQUE("email");