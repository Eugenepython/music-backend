//index.js (backend)

import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3001;
console.log("hello")
app.use(bodyParser.json());
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
    secure: true,
    tls: {
        rejectUnauthorized: false, // Use with caution, for debugging purposes
    },
});


console.log(process.env.GMAIL_USER);
console.log(process.env.GMAIL_PASSWORD);
app.post('/inviteApi', async (req, res) => {
    try {
        const receivedData = req.body;
        const emails = receivedData.emails;
        const gameTitle = receivedData.gameTitle;
        const gameCode = receivedData.gameCode;
        console.log(process.env.GMAIL_USER);
        const failedEmails = [];
        const successfulEmails = [];
        for (let i = 0; i < emails.length; i++) {
            console.log(emails[i]);
            const recipientEmail = emails[i];
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: recipientEmail,
                subject: 'Invitation to the Game',
                text: `You are invited to join the game of ${gameTitle}! Please use the ${gameCode} to join the game.`,
            };
            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent successfully:', info.response);
                successfulEmails.push(recipientEmail);
            } catch (error) {
                console.error(`Failed to send email to ${recipientEmail}:`, error.message);
                failedEmails.push(recipientEmail);
            }
        }
        //res.send({ success: successfulEmails, failure: failedEmails })
        res.send({ failures: failedEmails, successes: successfulEmails })
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

});

