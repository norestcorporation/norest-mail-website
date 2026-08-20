const initialData = {
  from: [{ name: "Mail Delivery Subsystem", email: "MAILER-DAEMON@localhost" }],
  to: [{ name: "Me", email: "ripun@norestmail.com" }],
  reply_to: undefined,
  senderEmail: "MAILER-DAEMON@localhost",
  senderName: "Mail Delivery Subsystem"
};

const accountEmail = "ripun@norestmail.com";
const userEmail = accountEmail;

const fromArray = Array.isArray(initialData.from) ? initialData.from :
  (initialData.from ? [{ email: initialData.from, name: initialData.senderName }] : []);
const isFromMe = userEmail && fromArray.some((f) => f?.email === userEmail);

const toArray = Array.isArray(initialData.to) ? initialData.to :
  (initialData.to ? [{ email: initialData.to }] : []);
const replyToArray = Array.isArray(initialData.reply_to) ? initialData.reply_to :
  (initialData.reply_to ? [{ email: initialData.reply_to }] : []);

const replyTo = isFromMe
  ? (toArray.map((t) => t?.email).filter(Boolean).join(', ') || initialData.to || '')
  : (replyToArray.map((rt) => rt?.email).filter(Boolean).join(', ') ||
    fromArray.map((f) => f?.email).filter(Boolean).join(', ') ||
    initialData.from || initialData.senderEmail || '');

console.log("replyTo:", replyTo);

