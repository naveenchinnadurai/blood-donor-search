import db from "../db_config";
import { donors } from "../db_config/schema";
import { eq } from "drizzle-orm/expressions";
import { Request, Response } from "express";

//Health Check controller
export const checkRoute = async (req: Request, res: Response) => {
  res.json({
    message: "Everything is fine",
  });
};

// Create a new user
export const createDonors = async (req: Request, res: Response) => {
  const { name, email, mobileNumber, location, bloodgroup } = req.body;

  console.log({ name, email, mobileNumber, location, bloodgroup });
  try {
    const newDonor = await db
      .insert(donors)
      .values({
        name,
        email,
        mobileNumber,
        location,
        joinedAt: new Date(),
        bloodgroup,
      })
      .returning();

    console.log(newDonor);
    res.status(201).json(newDonor[0]);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get all donors
export const getdonors = async (req: Request, res: Response) => {
  try {
    const alldonors = await db.select().from(donors);
    res.status(200).json(alldonors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch donors" });
  }
};

// Get a single user by Location
export const getDonorByLocation = async (req: Request, res: Response) => {
  const { location } = req.params;
  try {
    const donorsByLocation = await db
      .select()
      .from(donors)
      .where(eq(donors.location, location));
    console.log(donorsByLocation);

    if (donorsByLocation.length == 0) {
      res.json({ message: "No Donors in this location" });
    }

    res.status(200).json({
      donors: donorsByLocation,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
