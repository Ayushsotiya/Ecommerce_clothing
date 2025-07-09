const nodemailer = require("nodemailer");
require('dotenv').config();

exports.sendMail = async (email, title, body) => {
    try { 
        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth : {
                user : process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        let info = await transporter.sendMail({
            from: `BY OWNER OF ${process.env.COMPANY_NAME}`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        return info;
        
    } catch (error) {
        console.log("failed to send message")
    }
}

