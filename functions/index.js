const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const nodemailer = require("nodemailer");

const SMTP_HOST = defineSecret("SMTP_HOST");
const SMTP_PORT = defineSecret("SMTP_PORT");
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");

const PDF_MIME = "application/pdf";
const DEFAULT_MAIL_SUBJECT = "Protokol zkoušky provozuschopnosti záložního zdroje";
const MAX_ATTACHMENT_BYTES = 14 * 1024 * 1024;

function stringValue(value) {
  return String(value || "").trim();
}

function cleanFileName(value) {
  const name = stringValue(value).replace(/[\\/:*?"<>|]/g, "-").slice(0, 180);
  if (!name) return "protokol.pdf";
  if (name.toLowerCase().endsWith(".pdf")) return name;
  if (name.toLowerCase().endsWith(".docx")) return `${name.slice(0, -5)}.pdf`;
  return `${name}.pdf`;
}

function isPdfBuffer(buffer) {
  return Buffer.isBuffer(buffer)
    && buffer.length >= 5
    && buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

function astipEmail(request) {
  const email = stringValue(request.auth && request.auth.token && request.auth.token.email).toLowerCase();
  return email.endsWith("@astip.cz") ? email : "";
}

function validRecipientEmail(value) {
  const email = stringValue(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
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
  const recipientEmail = validRecipientEmail(data.recipientEmail || data.toEmail || data.to);
  if (!recipientEmail) {
    throw new HttpsError("invalid-argument", "Chybi platny e-mail prijemce.");
  }
  const subject = stringValue(data.subject) || DEFAULT_MAIL_SUBJECT;
  const body = stringValue(data.body) || "V priloze posilam vyexportovany protokol.";
  const fileBase64 = stringValue(data.fileBase64);
  if (!fileBase64) {
    throw new HttpsError("invalid-argument", "Chybi protokol k odeslani.");
  }

  const attachment = Buffer.from(fileBase64, "base64");
  if (!attachment.length || attachment.length > MAX_ATTACHMENT_BYTES) {
    throw new HttpsError("invalid-argument", "Priloha je prazdna nebo prilis velka.");
  }
  if (!isPdfBuffer(attachment)) {
    throw new HttpsError("invalid-argument", "Priloha protokolu musi byt PDF.");
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
    from: `"Servis záložních zdrojů" <${smtpUser}>`,
    replyTo: senderEmail,
    to: recipientEmail,
    subject,
    text: body,
    attachments: [{
      filename: cleanFileName(data.fileName),
      content: attachment,
      contentType: PDF_MIME
    }]
  });

  return {
    ok: true,
    to: recipientEmail
  };
});
