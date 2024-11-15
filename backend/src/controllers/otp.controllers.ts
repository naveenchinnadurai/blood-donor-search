import { Request, Response } from "express";
import crypto from "crypto";
import otpGenerator from "otp-generator";
import { transporter } from "../utils";

const otpStorage: Record<string, { salt: string; hash: string; expiresAt: number }> = {};

const OTP_EXPIRATION_TIME = 5 * 60 * 1000;

function hashOTP(otp: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha256").update(salt + otp).digest("hex");
    return { salt, hash };
}

export const sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const { salt, hash } = hashOTP(otp);
        const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

        otpStorage[email] = { salt, hash, expiresAt };

        await transporter.sendMail({
            from: "dev.iamnaveen@gmail.com",
            to: email,
            subject: "Your One-Time Password",
            text: `Your OTP is: ${otp}\n\nThis OTP will expire in ${OTP_EXPIRATION_TIME / 60 / 1000} minutes.`,
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error Sending OTP:", error);
        res.status(500).json({ error: "Error sending OTP" });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
    }

    try {
        const storedData = otpStorage[email];

        if (!storedData) {
            return res.status(400).json({ error: "No OTP found for this email" });
        }

        const { salt, hash, expiresAt } = storedData;

        if (Date.now() > expiresAt) {
            delete otpStorage[email];
            return res.status(400).json({ error: "OTP has expired" });
        }

        const newHash = crypto.createHash("sha256").update(salt + otp).digest("hex");
        if (newHash !== hash) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        delete otpStorage[email];
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error Verifying OTP:", error);
        res.status(500).json({ error: "Error verifying OTP" });
    }
};