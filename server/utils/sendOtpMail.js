import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "Career Compass <careercompass@resend.dev>",
      to: email,
      subject: "Verify your Career Compass account",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Career Compass Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:2px;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Resend email failed:", err);
    throw err;
  }
};
