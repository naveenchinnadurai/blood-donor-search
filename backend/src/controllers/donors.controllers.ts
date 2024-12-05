import db from "../db_config";
import { donors } from "../db_config/schema";
import { Request, Response } from "express";
import { eq, and, or } from "drizzle-orm";
import { validBloodGroups, validDonationTypes } from "../utils";

//Health Check controller
export const checkRoute = async (req: Request, res: Response) => {
  res.json({
    message: "Everything is fine",
  });
};

// Create a new user
export const registerDonor = async (req: Request, res: Response) => {
  const { name, email, mobileNumber, location, bloodGroup, donationType, organs } = req.body;

  const donor = await db.select().from(donors).where(or(eq(donors.email, email), eq(donors.mobileNumber, mobileNumber)));

  if (donor.length != 0) {
    res.status(201).json({ status: false, error: "A Donor already exists with the same Email or Phone Number!" });
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
        bloodGroup,
        donationType,
        organs
      })
      .returning();

    res.status(201).json({ donor: newDonor[0], status: true, message: "Donor joined, Successfully!!" });
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update the User by emailde
export const updateDonor = async (req: Request, res: Response) => {
  const { email } = req.params;
  const { name, newEmail, mobileNumber, location, bloodGroup, donationType, organs } = req.body;

  try {
    const existingDonor = await db.select().from(donors).where(eq(donors.email, email));

    if (existingDonor.length === 0) {
      res.status(200).json({ status: false, error: "Donor not found with the email" });
      return;
    }
    if (newEmail) {
      const conflictingDonor = await db
        .select()
        .from(donors)
        .where(eq(donors.email, newEmail))

      if (conflictingDonor.length > 0) {
        res.status(200).json({ status: false, error: "Email already in use" });
        return;
      }
    }

    if (mobileNumber) {

      const conflictingDonor = await db
        .select()
        .from(donors)
        .where(eq(donors.mobileNumber, mobileNumber))

      if (conflictingDonor.length > 0) {
        res.status(200).json({ status: false, error: "Mobile Number already in use" });
        return;
      }
    }

    const updatedDonor = await db
      .update(donors)
      .set({
        name: name ?? existingDonor[0].name,
        email: newEmail ?? existingDonor[0].email,
        mobileNumber: mobileNumber ?? existingDonor[0].mobileNumber,
        location: location ?? existingDonor[0].location,
        bloodGroup: bloodGroup ?? existingDonor[0].bloodGroup,
        donationType: donationType ?? existingDonor[0].donationType,
        organs: organs ?? existingDonor[0].organs
      })
      .where(eq(donors.email, email));

    res.status(200).json({
      status: true,
      message: "Donor's informations updated successfully!"
    });
  } catch (error) {
    console.error("Error updating donor:", error);
    res.status(500).json({ status: false, error: "Failed to update donor" });
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


export const getDonorByLocationBloodAndType = async (req: Request, res: Response) => {
  const { location, blood, donationType } = req.params;

  // Validate input parameters
  if (!validBloodGroups.includes(blood)) {
    res.json({
      status: false,
      message: "Invalid Blood Group",
    });
    return;
  }

  if (!validDonationTypes.includes(donationType)) {
    res.json({
      status: false,
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

    if (!donorsList || donorsList.length === 0) {
      res.status(200).json({
        status: false,
        error: "No Donors found for the given filters",
      });
      return;
    }

    res.status(200).json({ status: true, donors: donorsList });
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ status: false, error });
  }
};