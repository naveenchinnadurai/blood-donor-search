import nodemailer from 'nodemailer'
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: 'dev.iamnaveen@gmail.com',
      pass: "iyqsmoritptpgjun"
    }
  });

export const validBloodGroups = [
    'All',
    'A+ve', 
    'B+ve', 
    'O+ve', 
    'AB+ve', 
    'A-ve', 
    'B-ve', 
    'O-ve', 
    'AB-ve'
];

export const validDonationTypes = [ "All", "Both", "Blood", "Organ"];