import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

const sendIssueStatusEmail = async (to, issueTitle, message) => {
    await transporter.sendMail({
        from: `"TuApp" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Issue status updated: ${issueTitle}`,
        html: `<p>Hello,</p><p>${message}</p>`, 
    });
};

export { sendIssueStatusEmail };