import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testEmail = async () => {
    console.log('Testing Nodemailer with explicit Port 587...');
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log('Verifying configuration...');
        await transporter.verify();
        console.log('✅ Configuration Verified!');

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Code 587',
            text: 'Working!',
        });
        console.log('✅ Sent! ID:', info.messageId);
    } catch (error) {
        console.error('❌ Failed:', error);
    }
};

testEmail();
