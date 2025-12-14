const nodemailer = require('nodemailer');


const sendEmail = async (to, subject, text) => {
    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

    // 1. Mock Mode (Fallback)
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD || GMAIL_USER === 'example@gmail.com' || GMAIL_APP_PASSWORD === 'changeit') {
        console.log('==================================================');
        console.log(' [MOCK EMAIL SERVICE] ');
        console.log(` To: ${to}`);
        console.log(` Subject: ${subject}`);
        console.log(` Body: ${text}`);
        console.log('==================================================');
        return;
    }

    // 2. Real Gmail Transport (App Password)
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_APP_PASSWORD
            },
        });

        const mailOptions = {
            from: `Secure Vault <${GMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: `<p>${text}</p>`
        };

        await transport.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Email send failed:', error);
        // Fallback to log if real sending fails
        console.log(' [MOCK EMAIL FALLBACK] ');
        console.log(` Body: ${text}`);
    }
};

module.exports = sendEmail;
