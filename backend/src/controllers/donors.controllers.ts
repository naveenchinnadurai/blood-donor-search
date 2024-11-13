import db from "../db_config";
import { donors } from "../db_config/schema";
import { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { validBloodGroups } from "../utils";

//Health Check controller
export const checkRoute = async (req: Request, res: Response) => {
  res.json({
    message: "Everything is fine",
  });
};

// Create a new user
export const registerDonor = async (req: Request, res: Response) => {
  const { name, email, mobileNumber, location, bloodGroup } = req.body;

  console.log({ name, email, mobileNumber, location, bloodGroup });
  try {
    const newDonor = await db
      .insert(donors)
      .values({
        name,
        email,
        mobileNumber,
        location: location.toLowerCase(),
        joinedAt: new Date(),
        bloodGroup,
      })
      .returning();

    console.log(newDonor);
    res.status(201).json(newDonor[0]);
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get all donors
export const getdonors = async (req: Request, res: Response) => {
  try {
    const alldonors = await db.select().from(donors);
    res.status(200).json(alldonors);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch donors" });
  }
};

// Get users by Location
export const getDonorByLocation = async (req: Request, res: Response) => {
  const { location } = req.params;
  try {
    const donorsByLocation = await db
      .select()
      .from(donors)
      .where(eq(donors.location, location));

    if (donorsByLocation.length == 0) {
      res.json({ message: "No Donors in this location" });
      return;
    }

    res.status(200).json({
      donors: donorsByLocation,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get users by blood
export const getDonorByBlood = async (req: Request, res: Response) => {
  const { blood } = req.params;

  if (!validBloodGroups.includes(blood)) {
    res.json({
      message: "Invalid Blood Group"
    })
    return;
  }

  try {
    const donorsByBlood = await db
      .select()
      .from(donors)
      .where(eq(donors.bloodGroup, blood as "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve"));

    console.log(donorsByBlood);

    if (donorsByBlood.length == 0) {
      res.json({ message: "No Donors with this Blood Group" });
      return;
    }

    res.status(200).json({
      donors: donorsByBlood,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};


// Get users with Location and blood group
export const getDonorByLocationAndBlood = async (req: Request, res: Response) => {
  const { location, blood } = req.params;

  console.log({ location, blood })

  if (!validBloodGroups.includes(blood)) {
    res.json({
      message: "Invalid Blood Group"
    })
    return;
  }

  try {
    let donorsByLocation;
    if (blood === "All") {
      donorsByLocation = await db
        .select()
        .from(donors)
        .where(eq(donors.location, location.toLowerCase()));   //select user for location
    } else {
      donorsByLocation = await db
        .select()
        .from(donors)
        .where(and(eq(donors.location, location.toLowerCase()), eq(donors.bloodGroup, blood as "All" | "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve")));   //select user for location and blood
    }

    console.log(donorsByLocation);

    if (donorsByLocation.length == 0) {
      res.json({ message: "No Donors in this location" });
      return;
    }

    res.status(200).json({
      donors: donorsByLocation,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};
