const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"WalletBuddy" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to WalletBuddy! 👛';

    const text = `Hi ${name},\n\nWelcome to WalletBuddy! Your account has been created successfully.\n\nTrack your spending, split bills with friends, and stay on top of your finances — all in one place.\n\nGet started: https://expense-sync-three.vercel.app/\n\nBest,\nThe WalletBuddy Team`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#FFF3DC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF3DC; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding-bottom:28px;">
                            <h1 style="margin:0; font-size:28px; font-weight:900; color:#5C3D1E; letter-spacing:-0.5px;">
                                Wallet<span style="color:#A0622A;">Buddy</span>
                            </h1>
                            <p style="margin:4px 0 0; font-size:13px; color:#6B4E2E;">Your money. Your groups. One place.</p>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td style="background-color:#FFDDB3; border-radius:24px; padding:40px 36px;">

                            <!-- Welcome message -->
                            <p style="margin:0 0 8px; font-size:22px; font-weight:800; color:#5C3D1E;">
                                Hey ${name}! 👋
                            </p>
                            <p style="margin:0 0 24px; font-size:15px; color:#6B4E2E; line-height:1.6;">
                                Welcome aboard! Your <strong>WalletBuddy</strong> account has been created successfully. We're glad to have you here.
                            </p>

                            <!-- Divider -->
                            <hr style="border:none; border-top:1px solid #FFE8C0; margin:0 0 24px;" />

                            <!-- Features -->
                            <p style="margin:0 0 14px; font-size:13px; font-weight:700; color:#A0622A; text-transform:uppercase; letter-spacing:0.5px;">
                                Here's what you can do
                            </p>

                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding:8px 0;">
                                        <span style="font-size:18px;">💸</span>
                                        <span style="font-size:14px; color:#5C3D1E; margin-left:10px;">Track your daily income & expenses</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;">
                                        <span style="font-size:18px;">👥</span>
                                        <span style="font-size:14px; color:#5C3D1E; margin-left:10px;">Create group spaces for trips, flatmates & events</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;">
                                        <span style="font-size:18px;">🧮</span>
                                        <span style="font-size:14px; color:#5C3D1E; margin-left:10px;">Split bills equally, by percentage or custom shares</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;">
                                        <span style="font-size:18px;">📊</span>
                                        <span style="font-size:14px; color:#5C3D1E; margin-left:10px;">Visualize your spending with beautiful analytics</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <div style="text-align:center; margin-top:32px;">
                                <a href="https://expense-sync-three.vercel.app/"
                                   style="display:inline-block; background-color:#5C3D1E; color:#FFF3DC; text-decoration:none; font-size:15px; font-weight:700; padding:14px 36px; border-radius:100px;">
                                    Open WalletBuddy →
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top:28px;">
                            <p style="margin:0; font-size:12px; color:#A0622A;">
                                You're receiving this because you signed up at WalletBuddy.
                            </p>
                            <p style="margin:4px 0 0; font-size:12px; color:#A0622A;">
                                © ${new Date().getFullYear()} WalletBuddy. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;

    await sendEmail(userEmail, subject, text, html);
}


async function sendLoginEmail(userEmail, name) {
    const subject = 'New login to your WalletBuddy account 🔐';

    const text = `Hi ${name},\n\nWe noticed a new login to your WalletBuddy account. If this was you, no action is needed.\n\nIf you did not log in, please change your password immediately.\n\nBest,\nThe WalletBuddy Team`;

    const loginTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    })

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#FFF3DC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF3DC; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding-bottom:28px;">
                            <h1 style="margin:0; font-size:28px; font-weight:900; color:#5C3D1E; letter-spacing:-0.5px;">
                                Wallet<span style="color:#A0622A;">Buddy</span>
                            </h1>
                            <p style="margin:4px 0 0; font-size:13px; color:#6B4E2E;">Your money. Your groups. One place.</p>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td style="background-color:#FFDDB3; border-radius:24px; padding:40px 36px;">

                            <p style="margin:0 0 8px; font-size:22px; font-weight:800; color:#5C3D1E;">
                                Hey ${name}! 🔐
                            </p>
                            <p style="margin:0 0 24px; font-size:15px; color:#6B4E2E; line-height:1.6;">
                                We detected a new login to your <strong>WalletBuddy</strong> account.
                            </p>

                            <!-- Login details box -->
                            <table cellpadding="0" cellspacing="0" width="100%"
                                style="background-color:#FFE8C0; border-radius:16px; padding:18px 20px; margin-bottom:24px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 6px; font-size:12px; font-weight:700; color:#A0622A; text-transform:uppercase; letter-spacing:0.5px;">Login Time</p>
                                        <p style="margin:0; font-size:15px; font-weight:600; color:#5C3D1E;">${loginTime} IST</p>
                                    </td>
                                </tr>
                            </table>

                            <hr style="border:none; border-top:1px solid #FFE8C0; margin:0 0 24px;" />

                            <p style="margin:0 0 6px; font-size:14px; color:#6B4E2E; line-height:1.6;">
                                ✅ <strong>This was you?</strong> No action needed — you're all set.
                            </p>
                            <p style="margin:0 0 24px; font-size:14px; color:#6B4E2E; line-height:1.6;">
                                ⚠️ <strong>Wasn't you?</strong> Change your password immediately to secure your account.
                            </p>

                            <!-- CTA -->
                            <div style="text-align:center; margin-top:8px;">
                                <a href="https://expense-sync-three.vercel.app/"
                                   style="display:inline-block; background-color:#5C3D1E; color:#FFF3DC; text-decoration:none; font-size:15px; font-weight:700; padding:14px 36px; border-radius:100px;">
                                    Open WalletBuddy →
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top:28px;">
                            <p style="margin:0; font-size:12px; color:#A0622A;">
                                You're receiving this because you're signed in to WalletBuddy.
                            </p>
                            <p style="margin:4px 0 0; font-size:12px; color:#A0622A;">
                                © ${new Date().getFullYear()} WalletBuddy. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;

    await sendEmail(userEmail, subject, text, html);
}


async function sendSpaceInviteEmail(userEmail, memberName, invitedByName, spaceName, spaceType) {
    const subject = `You've been added to a space on WalletBuddy! 👥`;

    const text = `Hi ${memberName},\n\n${invitedByName} has added you to the "${spaceName}" space (${spaceType}) on WalletBuddy.\n\nLog in to view the space, see shared expenses, and track your balances.\n\nBest,\nThe WalletBuddy Team`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#FFF3DC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF3DC; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding-bottom:28px;">
                            <h1 style="margin:0; font-size:28px; font-weight:900; color:#5C3D1E; letter-spacing:-0.5px;">
                                Wallet<span style="color:#A0622A;">Buddy</span>
                            </h1>
                            <p style="margin:4px 0 0; font-size:13px; color:#6B4E2E;">Your money. Your groups. One place.</p>
                        </td>
                    </tr>

                    <!-- Card -->
                    <tr>
                        <td style="background-color:#FFDDB3; border-radius:24px; padding:40px 36px;">

                            <p style="margin:0 0 8px; font-size:22px; font-weight:800; color:#5C3D1E;">
                                Hey ${memberName}! 👋
                            </p>
                            <p style="margin:0 0 24px; font-size:15px; color:#6B4E2E; line-height:1.6;">
                                <strong>${invitedByName}</strong> has added you to a shared space on WalletBuddy.
                            </p>

                            <!-- Space details box -->
                            <table cellpadding="0" cellspacing="0" width="100%"
                                style="background-color:#FFE8C0; border-radius:16px; padding:20px 22px; margin-bottom:24px;">
                                <tr>
                                    <td style="padding-bottom:12px;">
                                        <p style="margin:0 0 4px; font-size:12px; font-weight:700; color:#A0622A; text-transform:uppercase; letter-spacing:0.5px;">Space Name</p>
                                        <p style="margin:0; font-size:17px; font-weight:800; color:#5C3D1E;">${spaceName}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style="margin:0 0 4px; font-size:12px; font-weight:700; color:#A0622A; text-transform:uppercase; letter-spacing:0.5px;">Type</p>
                                        <p style="margin:0; font-size:15px; font-weight:600; color:#5C3D1E; text-transform:capitalize;">${spaceType}</p>
                                    </td>
                                </tr>
                            </table>

                            <hr style="border:none; border-top:1px solid #FFE8C0; margin:0 0 24px;" />

                            <p style="margin:0 0 12px; font-size:13px; font-weight:700; color:#A0622A; text-transform:uppercase; letter-spacing:0.5px;">
                                Inside this space you can
                            </p>
                            <table cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding:6px 0; font-size:14px; color:#5C3D1E;">💸 &nbsp; See and add shared expenses</td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 0; font-size:14px; color:#5C3D1E;">⚖️ &nbsp; Check who owes whom</td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 0; font-size:14px; color:#5C3D1E;">✅ &nbsp; Record settlements to close debts</td>
                                </tr>
                            </table>

                            <!-- CTA -->
                            <div style="text-align:center; margin-top:32px;">
                                <a href="https://expense-sync-three.vercel.app/"
                                   style="display:inline-block; background-color:#5C3D1E; color:#FFF3DC; text-decoration:none; font-size:15px; font-weight:700; padding:14px 36px; border-radius:100px;">
                                    View Space →
                                </a>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top:28px;">
                            <p style="margin:0; font-size:12px; color:#A0622A;">
                                You received this because ${invitedByName} added you to a WalletBuddy space.
                            </p>
                            <p style="margin:4px 0 0; font-size:12px; color:#A0622A;">
                                © ${new Date().getFullYear()} WalletBuddy. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>`;

    await sendEmail(userEmail, subject, text, html);
}


async function sendOtpEmail(userEmail, name, otp) {
    const subject = `Your WalletBuddy OTP: ${otp}`;

    const text = `Hi ${name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.\n\nBest,\nThe WalletBuddy Team`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#FFF3DC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF3DC; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">
                    <tr>
                        <td align="center" style="padding-bottom:28px;">
                            <h1 style="margin:0; font-size:28px; font-weight:900; color:#5C3D1E; letter-spacing:-0.5px;">Wallet<span style="color:#A0622A;">Buddy</span></h1>
                            <p style="margin:4px 0 0; font-size:13px; color:#6B4E2E;">Your money. Your groups. One place.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#FFDDB3; border-radius:24px; padding:40px 36px;">
                            <p style="margin:0 0 8px; font-size:22px; font-weight:800; color:#5C3D1E;">Password Reset Request 🔑</p>
                            <p style="margin:0 0 28px; font-size:15px; color:#6B4E2E; line-height:1.6;">
                                Hey ${name}, we received a request to reset your <strong>WalletBuddy</strong> password. Use the OTP below to continue.
                            </p>
                            <div style="text-align:center; margin-bottom:28px;">
                                <div style="display:inline-block; background-color:#5C3D1E; color:#FFF3DC; font-size:38px; font-weight:900; letter-spacing:14px; padding:18px 32px; border-radius:20px;">
                                    ${otp}
                                </div>
                            </div>
                            <hr style="border:none; border-top:1px solid #FFE8C0; margin:0 0 20px;" />
                            <p style="margin:0 0 8px; font-size:13px; color:#6B4E2E; line-height:1.6; text-align:center;">⏱️ This OTP is valid for <strong>10 minutes</strong></p>
                            <p style="margin:0; font-size:13px; color:#6B4E2E; line-height:1.6; text-align:center;">🔒 Never share this OTP with anyone</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top:28px;">
                            <p style="margin:0; font-size:12px; color:#A0622A;">If you didn't request a password reset, you can safely ignore this email.</p>
                            <p style="margin:4px 0 0; font-size:12px; color:#A0622A;">© ${new Date().getFullYear()} WalletBuddy. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    await sendEmail(userEmail, subject, text, html);
}


async function sendPasswordChangedEmail(userEmail, name) {
    const subject = 'Your WalletBuddy password has been changed ✅';

    const changedTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    const text = `Hi ${name},\n\nYour WalletBuddy password was successfully changed on ${changedTime} IST.\n\nIf you did not make this change, please contact us immediately.\n\nBest,\nThe WalletBuddy Team`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#FFF3DC; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF3DC; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px; width:100%;">
                    <tr>
                        <td align="center" style="padding-bottom:28px;">
                            <h1 style="margin:0; font-size:28px; font-weight:900; color:#5C3D1E; letter-spacing:-0.5px;">Wallet<span style="color:#A0622A;">Buddy</span></h1>
                            <p style="margin:4px 0 0; font-size:13px; color:#6B4E2E;">Your money. Your groups. One place.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#FFDDB3; border-radius:24px; padding:40px 36px;">
                            <div style="text-align:center; margin-bottom:20px;"><span style="font-size:48px;">✅</span></div>
                            <p style="margin:0 0 8px; font-size:22px; font-weight:800; color:#5C3D1E; text-align:center;">Password Changed</p>
                            <p style="margin:0 0 28px; font-size:15px; color:#6B4E2E; line-height:1.6; text-align:center;">
                                Hey ${name}, your <strong>WalletBuddy</strong> password was successfully updated.
                            </p>
                            <table cellpadding="0" cellspacing="0" width="100%"
                                style="background-color:#FFE8C0; border-radius:16px; padding:16px 20px; margin-bottom:24px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 4px; font-size:12px; font-weight:700; color:#A0622A; text-transform:uppercase; letter-spacing:0.5px;">Changed at</p>
                                        <p style="margin:0; font-size:15px; font-weight:600; color:#5C3D1E;">${changedTime} IST</p>
                                    </td>
                                </tr>
                            </table>
                            <hr style="border:none; border-top:1px solid #FFE8C0; margin:0 0 20px;" />
                            <p style="margin:0 0 20px; font-size:14px; color:#6B4E2E; line-height:1.6;">
                                ⚠️ If you did <strong>not</strong> make this change, your account may be compromised. Change your password immediately.
                            </p>
                            <div style="text-align:center;">
                                <a href="https://expense-sync-three.vercel.app/"
                                   style="display:inline-block; background-color:#5C3D1E; color:#FFF3DC; text-decoration:none; font-size:15px; font-weight:700; padding:14px 36px; border-radius:100px;">
                                    Open WalletBuddy →
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top:28px;">
                            <p style="margin:0; font-size:12px; color:#A0622A;">You received this because your WalletBuddy password was changed.</p>
                            <p style="margin:4px 0 0; font-size:12px; color:#A0622A;">© ${new Date().getFullYear()} WalletBuddy. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    await sendEmail(userEmail, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendLoginEmail,
    sendSpaceInviteEmail,
    sendOtpEmail,
    sendPasswordChangedEmail,
};