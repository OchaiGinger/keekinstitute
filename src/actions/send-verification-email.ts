"use server";

import { auth } from "@clerk/nextjs/server";

interface SendVerificationEmailParams {
  studentEmail: string;
  studentName: string;
  verificationId: string;
}

export async function sendVerificationEmail({
  studentEmail,
  studentName,
  verificationId,
}: SendVerificationEmailParams) {
  try {
    const { userId: adminId } = await auth();
    
    if (!adminId) {
      throw new Error("Not authenticated");
    }

    const emailContent = `
      <h2>Welcome to Keek Institute!</h2>
      <p>Hi ${studentName},</p>
      <p>Your account has been verified by the admin. Please use the following ID to access your account:</p>
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 2px;">
          ${verificationId}
        </p>
      </div>
      <p><strong>Important:</strong> Keep this ID safe. You'll need it to log in for the first time.</p>
      <p>Steps to verify your account:</p>
      <ol>
        <li>Log in to your Keek Institute account</li>
        <li>Enter the verification ID above</li>
        <li>Complete your onboarding</li>
        <li>Start learning!</li>
      </ol>
      <p>If you have any questions, contact our support team.</p>
      <p>Best regards,<br>Keek Institute Admin Team</p>
    `;

    console.log(`[sendVerificationEmail] Sending email to ${studentEmail}`);
    console.log(`[sendVerificationEmail] Verification ID: ${verificationId}`);

    // Send email using Resend API via fetch
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[sendVerificationEmail] RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "noreply@keeinstitute.com",
        to: studentEmail,
        subject: "Your Keek Institute Verification ID",
        html: emailContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[sendVerificationEmail] Resend API error:", error);
      throw new Error(error.message || "Failed to send email");
    }

    const result = await response.json();
    console.log(`[sendVerificationEmail] Email sent successfully:`, result);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error("[sendVerificationEmail] Error:", error);
    throw error;
  }
}
