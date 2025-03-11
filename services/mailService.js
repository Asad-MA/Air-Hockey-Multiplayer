import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the email template path
const templatePath = path.join(__dirname, "../email-templates/email-verification.html");

// Read email template from file
const emailTemplate = fs.readFileSync(templatePath, "utf8");

// Replace placeholders in the template
const replaceTemplate = (template, data) => {
    return template.replace(/{{link}}/g, data.link);
};

// Email sender function
const sendEmail = async (toEmail, link) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "airhockeymultiplayer@gmail.com",
                pass: "cwcj miwd nevc nutm", // Use App Password instead of your real password
            },
        });


        // Prepare email content
        const mailOptions = {
            from: '"Air Hockey Multiplayer" <airhockeymultiplayer@gmail.com>',
            to: toEmail,
            subject: "Verify your Account!",
            html: replaceTemplate(emailTemplate, { link }), // Inject data into the template
        };

        // Send email
        await transporter.sendMail(mailOptions);
        return true;

    } catch (error) {
        console.error("Error sending email: ", error);
        return error;
    }
};

export default sendEmail;
