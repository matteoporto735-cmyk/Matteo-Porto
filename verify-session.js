const Stripe = require("stripe");
const { BY_PRICE } = require("./catalog");
const { createToken } = require("./token");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Metodo non consentito" });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.DOWNLOAD_SIGNING_SECRET) {
    return res.status(500).json({ error: "Configurazione server incompleta" });
  }

  const sessionId = req.query?.session_id;
  if (!sessionId || !String(sessionId).startsWith("cs_")) {
    return res.status(400).json({ error: "Sessione non valida" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items.data.price"] });
    if (session.payment_status !== "paid" || session.status !== "complete") {
      return res.status(402).json({ error: "Pagamento non ancora confermato" });
    }

    const priceIds = (session.line_items?.data || []).map(item => item.price?.id).filter(Boolean);
    const entitled = [];
    for (const priceId of priceIds) {
      const product = BY_PRICE[priceId];
      if (!product) continue;
      for (const file of product.files) {
        if (!entitled.some(x => x.key === file.key)) entitled.push(file);
      }
    }
    if (!entitled.length) return res.status(403).json({ error: "Nessun ebook associato a questo pagamento" });

    const exp = Date.now() + 60 * 60 * 1000; // link valido 1 ora
    const downloads = entitled.map(file => ({
      label: file.label,
      url: `/api/download?token=${encodeURIComponent(createToken({ sessionId, fileKey: file.key, exp }, process.env.DOWNLOAD_SIGNING_SECRET))}`
    }));

    return res.status(200).json({
      paid: true,
      email: session.customer_details?.email || session.customer_email || "",
      amountTotal: session.amount_total,
      currency: session.currency,
      downloads,
      expiresAt: exp
    });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: "Sessione non trovata" });
  }
};
