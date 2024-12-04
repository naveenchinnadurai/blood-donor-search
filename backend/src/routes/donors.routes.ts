import { checkRoute, registerDonor, updateDonor, getdonors, getDonorByLocationBloodAndType } from "../controllers/donors.controllers";
import express from "express";

const router = express.Router();

router.get("/", getdonors);

router.put("/:email",updateDonor)

router.get("/check", checkRoute);

router.get("/:location/:blood/:donationType", getDonorByLocationBloodAndType);

router.post("/", registerDonor);

export default router;
