import nodemailer from 'nodemailer';

export const emailConfirmation = async (data) => {
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
        subject: 'Check your account in VPM',
        text: 'Check your account in VPM',
        html: `
            <p>Hi ${name}! Check your account in VPM.</p>
            <p>Your account is ready, you just have to check it in the following link <a href='${process.env.FRONTEND_URL}/confirm/${token}'>Check account</a></p>
            <p>If you did not create this account you can ignore this message</p>
        `,
    });
    console.log(info.messageId);
};
