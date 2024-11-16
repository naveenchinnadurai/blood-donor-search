import { Request, Response } from "express";
import { generateRandomString, alphabet } from "oslo/crypto";
import { transporter } from "../utils";

const otpStorage: Record<string, { otp: string; expiresAt: number; timeoutId: NodeJS.Timeout }> = {};

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const sendOTP = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const otp = generateRandomString(6, alphabet("0-9"));

        const expiresAt = Date.now() + OTP_EXPIRATION_TIME;

        if (otpStorage[email]?.timeoutId) {
            clearTimeout(otpStorage[email].timeoutId);
        }

        const timeoutId = setTimeout(() => {
            delete otpStorage[email];
        }, OTP_EXPIRATION_TIME);

        otpStorage[email] = { otp, expiresAt, timeoutId };

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

        const { otp: storedOtp, expiresAt, timeoutId } = storedData;

        if (Date.now() > expiresAt) {
            delete otpStorage[email];
            return res.status(400).json({ error: "OTP has expired" });
        }

        if (otp !== storedOtp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        clearTimeout(timeoutId);
        delete otpStorage[email];

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error Verifying OTP:", error);
        res.status(500).json({ error: "Error verifying OTP" });
    }
};
