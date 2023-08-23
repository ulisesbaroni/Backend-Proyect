import nodemailer from "nodemailer";
import config from "../config.js";
import DMails from "../constants/DMails.js";
import { generateMailTemplate } from "../utils.js";

const APP_PASSWORD = "joxhtdwchewqsdqj";
const APP_EMAIL = "ulisesbaroni@gmail.com";

export default class mailService {
  constructor() {
    this.mailer = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        
        user: APP_EMAIL,
        pass: APP_PASSWORD,
      },
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