import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Error sending verification", error);
    throw new Error("Error sending verification email", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "30ccd1d4-82ed-4d99-bde0-a20c51b4ac0e",
      template_variables: {
        company_info_name: "Auth Company",
        name: name,
      },
    });
    console.log("Email send welcome sucessfully", response);
  } catch (error) {
    console.log("Error sending welcome email", error);
    throw new Error("Error sending welcome email", error);
  }
};
