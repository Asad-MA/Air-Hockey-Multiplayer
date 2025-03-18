// JUST staright forward function for prototype. Need to refactor it after.

import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace placeholders in the template
const replaceTemplate = (template, data) => {
    return template.replace(/{{link}}/g, data.link);
};

// Email sender function
const sendEmail = async (toEmail, subject, template ,link ) => {
    try {
        // Define the email template path
        const templatePath = path.join(__dirname, `../email-templates/${template}.html`);

        // Read email template from file
        const emailTemplate = fs.readFileSync(templatePath, "utf8");

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "airhockeymultiplayer@gmail.com",
                pass: "cwcj miwd nevc nutm", // App password for my email
            },
        });


        // Prepare email content
        const mailOptions = {
            from: '"Air Hockey Multiplayer" <no-reply@airhockeymultiplayer@gmail.com>',
            to: toEmail,
            subject: subject,
            html: replaceTemplate(emailTemplate, { link }), 
            headers: {
                "X-Mailer": "Nodemailer",
                "X-Priority": "3",
                "X-MSMail-Priority": "Normal",
                "Importance": "High",
                "List-Unsubscribe": "<mailto:unsubscribe@airhockeymultiplayer@gmail.com>",
            },
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
