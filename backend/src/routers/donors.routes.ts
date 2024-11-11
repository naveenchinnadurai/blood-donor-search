import { checkRoute, createDonors, getdonors, getDonorByLocation, getDonorByLocationAndBlood } from '../controllers/donors.controllers';
import express from 'express';

const router=express.Router();

router.get('/health-check',checkRoute)

router.get("/all",getdonors);

router.get("/:location",getDonorByLocation);

router.get('/', getDonorByLocationAndBlood)

router.post("/",createDonors);


export default router;