import { MailtrapClient } from "mailtrap";
import "dotenv/config";

const TOKEN = "b0ba643f416b87e49ac1a3a3652adb23";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
};
