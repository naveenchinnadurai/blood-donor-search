import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: 'dev.iamnaveen@gmail.com',
      pass: 'tcrcincykysotxim'
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