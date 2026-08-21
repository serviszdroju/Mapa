const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const nodemailer = require("nodemailer");

const SMTP_HOST = defineSecret("SMTP_HOST");
const SMTP_PORT = defineSecret("SMTP_PORT");
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PDF_MIME = "application/pdf";
const DEFAULT_MAIL_SUBJECT = "Protokol zkoušky provozuschopnosti záložního zdroje";
const MAX_ATTACHMENT_BYTES = 14 * 1024 * 1024;

function stringValue(value) {
  return String(value || "").trim();
}

function cleanFileName(value, fallbackExtension) {
  const name = stringValue(value).replace(/[\\/:*?"<>|]/g, "-").slice(0, 180);
  const extension = fallbackExtension === ".docx" ? ".docx" : ".pdf";
  return name.toLowerCase().endsWith(extension) ? name : `protokol${extension}`;
}

function attachmentMime(data) {
  const requested = stringValue(data.contentType || data.mimeType).toLowerCase();
  const name = stringValue(data.fileName).toLowerCase();
  if (requested === DOCX_MIME || name.endsWith(".docx")) return DOCX_MIME;
  return PDF_MIME;
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
  const contentType = attachmentMime(data);
  const extension = contentType === DOCX_MIME ? ".docx" : ".pdf";

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
      filename: cleanFileName(data.fileName, extension),
      content: attachment,
      contentType
    }]
  });

  return {
    ok: true,
    to: recipientEmail
  };
});
