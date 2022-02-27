import nodemailer from 'nodemailer';

export const emailRecoverPassword = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, name, token } = data;

    const info = await transporter.sendMail({
        from: 'VPM - Veterinary Patient Manager',
        to: email,
        subject: 'Recover your password',
        text: 'Recover your password',
        html: `
            <p>Hi ${name}! You have requested to reset your password.</p>
            <p>Follow the link below to generate a new password <a href='${process.env.FRONTEND_URL}/password-reset/${token}'>Reset password</a></p>
            <p>If you did not create this account you can ignore this message</p>
        `,
    });
    console.log(info.messageId);
};
