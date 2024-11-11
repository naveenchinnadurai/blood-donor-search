import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const donors = pgTable("donors", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    mobileNumber: text("mobile_number").unique(),
    joinedAt:timestamp("joined_at").default(new Date()),
    location: text("location").notNull(),
    bloodgroup:text("blood_group").notNull()
});