import { transporter } from "../configs/mail.js";

export const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Career Compass Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your Career Compass account",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Career Compass Email Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing:2px;">${otp}</h1>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};
