const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const nodemailer = require("nodemailer");

const SMTP_HOST = defineSecret("SMTP_HOST");
const SMTP_PORT = defineSecret("SMTP_PORT");
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");

const MAIL_TO = "iva.glozova@astip.cz";
const MAIL_CC = "jan.soldan@astip.cz";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

function stringValue(value) {
  return String(value || "").trim();
}

function cleanFileName(value) {
  const name = stringValue(value).replace(/[\\/:*?"<>|]/g, "-").slice(0, 180);
  return name.endsWith(".docx") ? name : "protokol.docx";
}

function astipEmail(request) {
  const email = stringValue(request.auth && request.auth.token && request.auth.token.email).toLowerCase();
  return email.endsWith("@astip.cz") ? email : "";
}

exports.sendProtocolMail = onCall({
  region: "europe-west1",
  invoker: "public",
  secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS],
  timeoutSeconds: 60,
  memory: "256MiB"
}, async (request) => {
  const senderEmail = astipEmail(request);
  if (!senderEmail) {
    throw new HttpsError("permission-denied", "Odeslani protokolu je povolene jen prihlasenym uzivatelum @astip.cz.");
  }

  const data = request.data || {};
  const subject = stringValue(data.subject) || "Protokol zkousky provozuschopnosti";
  const body = stringValue(data.body) || "V priloze posilam vyexportovany protokol.";
  const fileBase64 = stringValue(data.fileBase64);
  if (!fileBase64) {
    throw new HttpsError("invalid-argument", "Chybi Word protokol k odeslani.");
  }

  const attachment = Buffer.from(fileBase64, "base64");
  if (!attachment.length || attachment.length > MAX_ATTACHMENT_BYTES) {
    throw new HttpsError("invalid-argument", "Priloha je prazdna nebo prilis velka.");
  }

  const port = Number(SMTP_PORT.value() || 587);
  const smtpUser = SMTP_USER.value();
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST.value(),
    port,
    secure: port === 465,
    auth: {
      user: smtpUser,
      pass: SMTP_PASS.value()
    }
  });

  await transporter.sendMail({
    from: `"SZZ servisni mapa" <${smtpUser}>`,
    replyTo: senderEmail,
    to: MAIL_TO,
    cc: MAIL_CC,
    subject,
    text: body,
    attachments: [{
      filename: cleanFileName(data.fileName),
      content: attachment,
      contentType: DOCX_MIME
    }]
  });

  return {
    ok: true,
    to: MAIL_TO,
    cc: MAIL_CC
  };
});
