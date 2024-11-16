import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const bloodGroup = pgEnum('blood_groups', ['All','A+ve', 'B+ve', 'O+ve','AB+ve','A-ve', 'B-ve', 'O-ve','AB-ve']);

export const donationsType = pgEnum('donation_type', ['Both', 'Blood', 'Organ']);

export const donors = pgTable("donors", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    mobileNumber: text("mobile_number").unique(),
    joinedAt:timestamp("joined_at").default(new Date()),
    location: text("location").notNull(),
    bloodGroup:bloodGroup("blood_group").notNull(),
    donationType: donationsType("donation_type").notNull()
});