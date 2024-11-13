import { boolean, pgTable, text, timestamp, uuid,pgEnum } from "drizzle-orm/pg-core";

export const bloodGroup = pgEnum('bloodGroup', ['All','A+ve', 'B+ve', 'O+ve','AB+ve','A-ve', 'B-ve', 'O-ve','AB-ve']);


export const donors = pgTable("donors", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    mobileNumber: text("mobile_number").unique(),
    joinedAt:timestamp("joined_at").default(new Date()),
    location: text("location").notNull(),
    bloodGroup:bloodGroup("blood_group").notNull()
});

export const otp=pgTable("otp",{
    id:uuid("id").primaryKey().notNull(),
    mobileNumber:text("mobile_number").notNull().unique(),
    otp:text("otp").unique().notNull(),
    expiry:timestamp().notNull(),
    verified:boolean("verified").notNull().default(false)
})