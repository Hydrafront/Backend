import { Router, Response } from "express";
import { validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import nodemailer from "nodemailer";
import Request from "../../types/Request";
const router: Router = Router();

router.post("/send-email", async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  const { email, name, discord, telegram, twitter, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const text = `
    Name: ${name}
    Email: ${email}
    ${discord ? `Discord: ${discord}` : ""}
    ${telegram ? `Telegram: ${telegram}` : ""}
    ${twitter ? `Twitter: ${twitter}` : ""}
    Message: ${message}
  `.trim();

  const mailOptions = {
    from: email,
    to: process.env.EMAIL,
    subject: "Contact Us",
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("success");
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Email sending failed!" });
  }
});

export default router;
