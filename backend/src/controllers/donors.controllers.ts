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
  const { name, email, mobileNumber, location, bloodGroup, donationType } = req.body;

  console.log({ name, email, mobileNumber, location, bloodGroup });
  try {
    const newDonor = await db
      .insert(donors)
      .values({
        name,
        email,
        mobileNumber,
        location,
        joinedAt: new Date(),
        bloodGroup,
        donationType
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
    let donorsByLocation;
    if (location === "All") {
      donorsByLocation = await db
        .select()
        .from(donors);
    } else {
      donorsByLocation = await db
        .select()
        .from(donors)
        .where(eq(donors.location, location.toLowerCase()));
    }

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
    let donor;
    if (blood === "All" && location === "All") {
      const alldonors = await db.select().from(donors);
      res.status(200).json({ donors: alldonors });
      return;
    } else if (blood === "All") { //select user for location
      donor = await db
        .select()
        .from(donors)
        .where(eq(donors.location, location));
    } else if (location === "All") {  //select user for blood
      donor = await db
        .select()
        .from(donors)
        .where(eq(donors.bloodGroup, blood as "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve"));
    } else {  //select user for location and blood
      donor = await db
        .select()
        .from(donors)
        .where(and(eq(donors.location, location), eq(donors.bloodGroup, blood as "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve")));
    }

    console.log(donor);

    if (donor.length == 0) {
      res.json({ message: "No Donors in this location" });
      return;
    }

    res.status(200).json({
      donors: donor,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};
