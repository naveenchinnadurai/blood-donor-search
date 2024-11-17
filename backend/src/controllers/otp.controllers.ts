import { Request, Response } from "express";
import { transporter } from "../utils";
import { generate } from "otp-generator";
import db from "../db_config";
import { donors } from "../db_config/schema";
import { eq } from "drizzle-orm";

const otpStorage: Record<string, { otp: string; expiresAt: number; timeoutId: NodeJS.Timeout }> = {};

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        res.status(200).json({ isSuccess:false, error: "Email is required" });
        return ;
    }

    const donor= await db.select().from(donors).where(eq(donors.email,email));
    
    if(donor.length!=0) {
        console.log("something")
        res.status(200).json({isSuccess:false, error:"Donor already exists!"});
        return ;
    }

    try {
        const otp = generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, });

        const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

        if (otpStorage[email]?.timeoutId) {
            clearTimeout(otpStorage[email].timeoutId);
        }

        const timeoutId = setTimeout(() => {
            delete otpStorage[email];
        }, OTP_EXPIRATION_TIME);

        otpStorage[email] = { otp, expiresAt, timeoutId };
        console.log(otpStorage)

        await transporter.sendMail({
            from: "dev.iamnaveen@gmail.com",
            to: email,
            subject: "Your One-Time Password",
            text: `Your OTP is: ${otp}, don't share it to anyone.\n\nThis OTP will expire in 5 minutes.`,
        });

        res.status(200).json({ isSuccess:true, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    console.log(otpStorage)
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(200).json({ isSuccess:false, error: "Email and OTP are required" });
        return ;
    }

    try {
        const storedData = otpStorage[email];

        if (!storedData) {
            res.status(200).json({ isSuccess:false, error: "No OTP found!!" });
            return ;
        }

        const { otp: storedOtp, expiresAt, timeoutId } = storedData;

        if (Date.now() > expiresAt) {
            delete otpStorage[email];
            res.status(200).json({ isSuccess:false, error: "OTP has expired" });
            return ;
        }

        if (otp !== storedOtp) {
            res.status(200).json({ isSuccess:false, error: "Invalid OTP" });
            return ;
        }
        
        clearTimeout(timeoutId);
        delete otpStorage[email];

        res.status(200).json({ isSuccess:true, message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};
