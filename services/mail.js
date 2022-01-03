// IMPORTS

const config = require("../config");
const nodemailer = require("nodemailer");
const path = require("path");

const handlebars = require("handlebars");
const fs = require("fs");

// NODEMAILER LOGIC

// handle nodemailer transporter
const handleTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: config.smtp,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

// handle nodemailer mail options
const handleMailOptions = (emailConfig) => {

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: emailConfig.email,
    subject: emailConfig.subject,
    html: handleHtmlFile(emailConfig),
  };

  if (emailConfig.path === "/templates/resume.hbs") {
    mailOptions.attachments = [
      {
        path: handlePath() + `/assets/resume.docx`,
      },
      {
        // path: handlePath() + `/assets/resume.pdf`,
      },
    ];
  }

  return mailOptions;
};

// handle nodemailer config data
const handleEmailConfig = (config) => {
  if (config.template === "resume") {
    return {
      email: config.email,
      path: "/templates/resume.hbs",
      subject: "חיפוש משרה - דביר מונגם",
      replacement: { name: config.payload.name },
    };
  }

  if (config.template === "message") {
    return {
      email: process.env.USER_EMAIL,
      path: "/templates/message.hbs",
      subject: "קורות חיים נשלחו בהצלחה",
      replacement: {
        email: config.email,
        ame: config.payload.name,
        company: config.payload.company,
      },
    };
  }
};

// function to send email
const sendEmail = async (emailConfig) => {
  const transporter = handleTransporter();
  const mailOptions = handleMailOptions(emailConfig);
  const info = await transporter.sendMail(mailOptions);
  return info;
};

// main function to send emails
const handleEmail = async (config) => {
  const emailConfig = handleEmailConfig(config);
  const info = await sendEmail(emailConfig);
  return info;
};

// MAIL HANDLER

const sendResumeMail = async (data) => {
  const config = {
    email: data.email,
    template: "resume",
    payload: data,
  };

  return await handleEmail(config);
};
const sendMessageMail = async (data) => {
  const config = {
    email: data.email,
    template: "message",
    payload: data,
  };
  return await handleEmail(config);
};

// MAIL UTILITIES LOGIC

// get file source path
const handlePath = () => {
  const htmlUrl = __dirname.split("services");
  return htmlUrl[0];
};

// get email template path
const handleUrl = (emailConfig) => {
  return path.join(handlePath(), emailConfig.path);
};

// read email template
const handleTemplate = (filePath) => {
  const source = fs.readFileSync(filePath, "utf-8").toString();
  return handlebars.compile(source);
};

// insert request data to email template
const handleHtmlFile = (emailConfig) => {
  const filePath = handleUrl(emailConfig);
  const template = handleTemplate(filePath);
  return template(emailConfig.replacement);
};

module.exports = {
  sendResumeMail,
  sendMessageMail,
};
