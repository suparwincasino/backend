// backend/workflows/user-signup.ts
import { v } from "convex/values";
import { mutation } from "../convex/_generated/server";
import crypto from "crypto";
import twilio from "twilio";
import nodemailer from "nodemailer";
import TelegramBot from "node-telegram-bot-api";
import Parse from "parse/node";

// -------------------------
// 1️⃣ Initialize Back4App
// -------------------------
Parse.initialize(
  process.env.BACK4APP_APP_ID!,
  process.env.BACK4APP_JS_KEY!
);
Parse.serverURL = "https://parseapi.back4app.com";

// -------------------------
// 2️⃣ Initialize Twilio
// -------------------------
const smsClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP;

// -------------------------
// 3️⃣ Initialize Email
// -------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------------
// 4️⃣ Initialize Telegram Bot
// -------------------------
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// -------------------------
// 5️⃣ Utility Functions
// -------------------------
function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send Email Verification
async function sendEmailVerification(email: string, token: string) {
  const url = `https://superwincasino.com/verify-email?token=${token}`;
  await transporter.sendMail({
    from: "SuperWin Casino <no-reply@superwincasino.com>",
    to: email,
    subject: "Verify your email",
    html: `Click <a href="${url}">here</a> to verify your email.`,
  });
}

// Send SMS/WhatsApp OTP
async function sendPhoneOtp(phone: string, otp: string) {
  // SMS
  await smsClient.messages.create({
    body: `SuperWin Casino OTP: ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });

  // WhatsApp
  await smsClient.messages.create({
    body: `SuperWin Casino OTP: ${otp}`,
    from: `whatsapp:${WHATSAPP_NUMBER}`,
    to: `whatsapp:${phone}`,
  });
}

// Send Telegram OTP
async function sendTelegramOtp(telegramId: string, otp: string) {
  await telegramBot.sendMessage(telegramId, `Your SuperWin Casino code: ${otp}`);
}

// -------------------------
// 6️⃣ Main Signup Mutation
// -------------------------
export const userSignup = mutation({
  args: {
    email: v.string(),
    phone: v.string(),
    username: v.string(),
    telegramId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email, phone, username, telegramId } = args;

    // Generate verification tokens/OTPs
    const emailToken = crypto.randomBytes(32).toString("hex");
    const phoneOtp = generateOtp();
    const telegramOtp = telegramId ? generateOtp() : null;

    // 1️⃣ Save user record in Back4App
    const User = Parse.Object.extend("User");
    const user = new User();
    user.set("email", email);
    user.set("phone", phone);
    user.set("username", username);
    user.set("emailVerified", false);
    user.set("phoneVerified", false);
    user.set("telegramVerified", false);
    user.set("emailToken", emailToken);
    user.set("phoneOtp", phoneOtp);
    if (telegramOtp) user.set("telegramOtp", telegramOtp);
    await user.save();

    // 2️⃣ Send verification channels
    await sendEmailVerification(email, emailToken);
    await sendPhoneOtp(phone, phoneOtp);
    if (telegramId && telegramOtp) await sendTelegramOtp(telegramId, telegramOtp);

    return {
      userId: user.id,
      message: "Verification codes sent via email, SMS/WhatsApp, and Telegram (if provided)",
    };
  },
});
