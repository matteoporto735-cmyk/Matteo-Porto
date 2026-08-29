const Stripe = require("stripe");

module.exports.config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

async function sendEmail(session) {
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.SITE_URL) return;
  const email = session.customer_details?.email || session.customer_email;
  if (!email) return;
  const url = `${process.env.SITE_URL.replace(/\/$/, "")}/success.html?session_id=${encodeURIComponent(session.id)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to: [email],
      subject: "I tuoi ebook FitBooks sono pronti",
      html: `<p>Grazie per il tuo acquisto FitBooks.</p><p><a href="${url}">Apri la pagina sicura per scaricare i tuoi ebook</a>.</p><p>Se il link non funziona, rispondi a questa email per assistenza.</p>`
    })
  });
  if (!response.ok) console.error("Resend error", await response.text());
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Metodo non consentito");
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send("Webhook non configurato");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const raw = await readRawBody(req);
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.payment_status === "paid") await sendEmail(session);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
