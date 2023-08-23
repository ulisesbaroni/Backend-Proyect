import nodemailer from "nodemailer";
import config from "../config.js";
import DMails from "../constants/DMails.js";
import { generateMailTemplate } from "../utils.js";

export default class mailService {
  constructor() {
    this.mailer = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
      },

      tls: {
        rejectUnauthorized: false
      }
      
    });
  }

  sendMail = async (emails, template, payload) => {
    const mailInfo = DMails[template];
    const html = await generateMailTemplate(template, payload);
    const result = await this.mailer.sendMail({
      from: "Backend",
      to: emails,
      html,
      ...mailInfo,
    });
    return result;
  };
}