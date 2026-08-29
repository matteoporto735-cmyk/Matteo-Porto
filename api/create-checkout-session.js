const Stripe = require("stripe");
const { PRODUCTS } = require("./catalog");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.SITE_URL) {
    return res.status(500).json({ error: "Configurazione server incompleta" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const ids = Array.isArray(req.body?.items) ? [...new Set(req.body.items)] : [];
    if (!ids.length) return res.status(400).json({ error: "Carrello vuoto" });
    if (ids.some(id => !PRODUCTS[id])) return res.status(400).json({ error: "Prodotto non valido" });

    // Se sono presenti tutti e tre gli ebook singoli, applica automaticamente il prezzo bundle.
    const singles = ["habits", "meal", "mindful"];
    const hasAllSingles = singles.every(id => ids.includes(id));
    let checkoutIds = hasAllSingles ? ["bundle"] : ids;

    // Il bundle non può essere combinato con altri prodotti.
    if (checkoutIds.includes("bundle")) checkoutIds = ["bundle"];

    const line_items = checkoutIds.map(id => ({ price: PRODUCTS[id].priceId, quantity: 1 }));
    const site = process.env.SITE_URL.replace(/\/$/, "");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_creation: "always",
      billing_address_collection: "auto",
      success_url: `${site}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/index.html#catalogo`,
      metadata: {
        brand: "FitBooks",
        delivery: "protected-download"
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Impossibile avviare il checkout" });
  }
};
