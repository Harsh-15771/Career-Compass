import { google } from "googleapis";

export const sendOtpMail = async (email, otp) => {
  try {
    // Instantiate OAuth2Client dynamically to ensure environment variables are fully loaded
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:3000/oauth2callback"
    );

    // Set the credentials dynamically at call time
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    console.log("[DEBUG] sendOtpMail (Gmail API) called.");
    console.log("[DEBUG] Target Email:", email);
    console.log("[DEBUG] Sender Account:", process.env.SENDER_EMAIL);

    const subject = "Verify your Career Compass account";
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    
    // Generate a unique boundary string for MIME parts
    const boundary = "----=_Part_" + Math.random().toString(36).substring(2);

    const textBody = `Hello,

Thank you for choosing Career Compass. Please use the following One-Time Password (OTP) to complete your account verification:

OTP: ${otp}

This OTP is valid for 10 minutes. Do not share this OTP with anyone.

Career Compass — Career Guidance & Resume Platform`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #5044e5; text-align: center;">Career Compass Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for choosing Career Compass. Please use the following One-Time Password (OTP) to complete your account verification:</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1.5px dashed #5044e5;">
          <h1 style="letter-spacing: 4px; font-size: 32px; font-weight: 800; color: #1e293b; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP is valid for <b>10 minutes</b>. Do not share this OTP with anyone.</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center;">
          Career Compass — Career Guidance & Resume Platform
        </p>
      </div>
    `;

    // Construct MIME multipart message (RFC 2046 compliant)
    const emailContent = [
      `From: "Career Compass" <${process.env.SENDER_EMAIL}>`,
      `To: ${email}`,
      `Subject: ${utf8Subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      textBody,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlBody,
      ``,
      `--${boundary}--`,
    ].join("\r\n");

    // Base64URL encode the entire message payload
    const encodedMessage = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send the email using the Gmail API
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("[DEBUG] Gmail API email sent successfully. Message ID:", response.data.id);
  } catch (err) {
    console.error("Gmail API email sending failed:", err);
    throw err;
  }
};
