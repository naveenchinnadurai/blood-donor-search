import db from "../db_config";
import { donors } from "../db_config/schema";
import { Request, Response } from "express";
import { eq, and, or } from "drizzle-orm";
import { validBloodGroups, validDonationTypes } from "../utils";
import { assert } from "console";

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

  const donor = await db.select().from(donors).where(or(eq(donors.email, email), eq(donors.mobileNumber, mobileNumber)));

  if (donor.length != 0) {
    res.status(201).json({ isSuccess: false, error: "A Donor already exists with the same Email or Phone Number!" });
    return;
  }

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
    res.status(201).json({ donor: newDonor[0], isSuccess: true, message: "Donor joined, Successfully!!" });
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
      res.status(200).json({ message: "No Donors in this location" });
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
    res.status(200).json({
      isSuccess: false,
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
      res.status(200).json({ isSuccess: false, message: "No Donors with this Blood Group" });
      return;
    }

    res.status(200).json({
      isSuccess: true,
      donors: donorsByBlood,
    });
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getDonorByLocationBloodAndType = async (req: Request, res: Response) => {
  const { location, blood, donationType } = req.params;

  console.log({ location, blood, donationType });

  // Validate input parameters
  if (!validBloodGroups.includes(blood)) {
    res.json({
      isSuccess: false,
      message: "Invalid Blood Group",
    });
    return;
  }

  if (!validDonationTypes.includes(donationType)) {
    res.json({
      isSuccess: false,
      message: "Invalid Donation Type",
    });
    return;
  }

  try {
    let donorsList;

    // Handle "All" cases
    if (blood === "All" && location === "All" && donationType === "All") {
      donorsList = await db.select().from(donors);
    } else if (blood === "All" && location === "All") {
      donorsList = await db
        .select()
        .from(donors)
        .where(eq(donors.donationType, donationType as "Both" | "Blood" | "Organ"));
    } else if (blood === "All" && donationType === "All") {
      donorsList = await db
        .select()
        .from(donors)
        .where(eq(donors.location, location));
    } else if (location === "All" && donationType === "All") {
      donorsList = await db
        .select()
        .from(donors)
        .where(eq(donors.bloodGroup, blood as "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve"));
    } else if (blood === "All") {
      donorsList = await db
        .select()
        .from(donors)
        .where(and(
          eq(donors.location, location),
          eq(donors.donationType, donationType as "Both" | "Blood" | "Organ")
        ));
    } else if (location === "All") {
      donorsList = await db
        .select()
        .from(donors)
        .where(and(
          eq(donors.bloodGroup, blood as "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve"),
          eq(donors.donationType, donationType as "Both" | "Blood" | "Organ")
        ));
    } else if (donationType === "All") {
      donorsList = await db
        .select()
        .from(donors)
        .where(and(
          eq(donors.location, location),
          eq(donors.bloodGroup, blood as "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve")
        ));
    } else {
      // Filter by all three parameters
      donorsList = await db
        .select()
        .from(donors)
        .where(and(
          eq(donors.location, location),
          eq(donors.bloodGroup, blood as "A+ve" | "B+ve" | "O+ve" | "AB+ve" | "A-ve" | "B-ve" | "O-ve" | "AB-ve"),
          eq(donors.donationType, donationType as "Both" | "Blood" | "Organ")
        ));
    }

    console.log(donorsList);

    if (!donorsList || donorsList.length === 0) {
      res.status(200).json({
        isSuccess: false,
        error: "No Donors found for the given filters",
      });
      return;
    }

    res.status(200).json({ isSuccess: true, donors: donorsList });
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ isSuccess: false, error });
  }
};