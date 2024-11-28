import { checkRoute, registerDonor, getdonors, getDonorByLocation, getDonorByLocationBloodAndType, getDonorByBlood } from "../controllers/donors.controllers";
import express from "express";

const router = express.Router();

router.get("/", getdonors);

router.get("/health-check", checkRoute);

router.get("/location/:location", getDonorByLocation);

router.get("/blood/:blood", getDonorByBlood);

router.get("/:location/:blood/:donationType", getDonorByLocationBloodAndType);

router.post("/", registerDonor);

export default router;
