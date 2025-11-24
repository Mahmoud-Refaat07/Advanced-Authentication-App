import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import "dotenv/config";
import { Resend } from "resend";

export const resend = new Resend("e_aqa3FsxZ_HwtA8RPQkDC6VEVca8utwcp3");

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      template_uuid: "30ccd1d4-82ed-4d99-bde0-a20c51b4ac0e",
      template_variables: {
        company_info_name: "Auth Company",
        name: name,
      },
    });
    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
    console.log("Email sent successfully:", data);

    console.log("Email send welcome sucessfully", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
    throw new Error("Error sending welcome email", error);
  }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
    console.log("Reset password sending sucessfully", data);
  } catch (error) {
    console.log("Error sending reset password ", error);
    throw new Error("Error sending reset password", error);
  }
};

export const sendResetSucessEmail = async (email) => {
  try {
    const { data, error } = await mailtrapClient.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset Sucessfull",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Reset Passowrd",
    });
    if (error) {
      console.error("Resend error:", error);
      throw error;
    }
    console.log("Passowrd reset sucessfully", data);
  } catch (error) {
    console.log("Error sendResetSucessEmail ", error);
    throw new Error("Error sendResetSucessEmail", error);
  }
};
