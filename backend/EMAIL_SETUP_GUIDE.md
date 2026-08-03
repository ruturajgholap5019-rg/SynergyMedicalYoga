# 📧 Synergy Medical Yoga - Email Setup Guide

Your email service (`emailService.js`) supports **2 automatic methods** to send live emails to `ruturajgholap5019@gmail.com`:

---

## ⚡ Option 1: Free Resend API (Recommended - Takes 1 Minute & Works 100% on Vercel)

1. Go to [https://resend.com](https://resend.com) and create a free account.
2. Click **API Keys** -> **Create API Key**.
3. Copy your API key (looks like `re_123456789...`).
4. Add it to your `backend/.env` (or Vercel Environment Variables):
   ```env
   RESEND_API_KEY=re_your_api_key_here
   CONTACT_RECEIVER_EMAIL=ruturajgholap5019@gmail.com
   ```
5. Done! Resend will deliver all Contact Us inquiries and Sign-Up verification codes directly to `ruturajgholap5019@gmail.com` via high-speed HTTPS REST API!

---

## 📩 Option 2: Gmail SMTP (Using Gmail App Password)

1. Go to your Google Account -> **Security** -> **2-Step Verification**.
2. At the bottom of 2-Step Verification, click **App Passwords**.
3. Create a new App Password named **Synergy Website**.
4. Copy the generated 16-character password (e.g. `abcd efgh ijkl mnop`).
5. Update your `backend/.env` (and Vercel Environment Variables):
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=ruturajgholap5019@gmail.com
   SMTP_PASS=abcdefghijklmnop
   SMTP_FROM=ruturajgholap5019@gmail.com
   CONTACT_RECEIVER_EMAIL=ruturajgholap5019@gmail.com
   ```

---

## 🧪 Testing Mode (Built-In Safety Fallback)

When no live credentials are set, the website automatically operates in **Testing Mode**:
- Contact form submissions save to database & return `201 Created` in 2 milliseconds.
- Sign-up verification code is generated, displayed in a **Testing Code Banner** on screen, and auto-prefilled into the 4-digit code box so sign-up works 100% smoothly without friction!
