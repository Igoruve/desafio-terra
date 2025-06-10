import nodemailer from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: async () => {
      const accessToken = await oAuth2Client.getAccessToken();
      return accessToken.token;
    },
  },
});

function formatDate(dateInput) {
  const date = new Date(dateInput);
  const formatted = date.toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offset = `GMT${offsetMinutes <= 0 ? "+" : "-"}${offsetHours
    .toString()
    .padStart(2, "0")}`;

  return `${formatted} (${offset})`;
}

const sendIssueStatusEmail = async (to, userName, userEmail, issueType, previousStatus,newStatus, clientComment, createdAt, terraComments="Nothing to say", updateDate, updateMessage) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2E86C1;">Issue Status Update</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>We wanted to inform you that the status of your issue has been updated.</p>
      <hr />
      <h3>Issue Details:</h3>
      <ul>
        <li><strong>Type:</strong> ${issueType}</li>
        <li><strong>Created by:</strong> ${userEmail}</li>
        <li><strong>Created on:</strong> ${formatDate(createdAt)}</li>
        <li><strong>Client Comment:</strong> ${clientComment}</li>
        <li><strong>Status:</strong> ${previousStatus} ==> ${newStatus}</li>
        </ul>
        <br />
      <p><strong>Message:</strong></p>
      <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${terraComments}</p>
      <p>Updated on: ${formatDate(updateDate)}</p>
      <hr />
      <p>If you have any questions, feel free to reply to this email or contact support at <a href="mailto:easybyterra@gmail.com">easybyterra@gmail.com</a>.</p>
      <p>Best regards,<br />easy by Terra Dev Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"easy by Terra Dev Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Update on your issue: ${updateMessage}`,
    html: htmlContent,
  });
};

const sendRecoveryEmail = async (to, resetUrl) => {
/*   const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;*/
  console.log("la url es: ", resetUrl);
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2E86C1;">Password Recovery</h2>
      <p>Hi,</p>
      <p>You have requested to recover your password. Please click the following link to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2E86C1; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>The link will expire in 1 hour.</p>
      <p>Best regards,<br />easy by Terra Dev Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"easy by Terra Dev Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Recovery",
    html: htmlContent,
  });
};

export { sendIssueStatusEmail, sendRecoveryEmail };