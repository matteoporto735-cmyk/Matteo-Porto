const PRODUCTS = {
  habits: {
    priceId: "price_1U9mHRKqS4dFMFhr8Yv4YEEL",
    title: "21 Giorni di Abitudini Sane",
    amount: 990,
    files: [{ key: "habits", label: "21 Giorni di Abitudini Sane", filename: "FitBooks_21_Giorni_di_Abitudini_Sane.pdf" }]
  },
  meal: {
    priceId: "price_1U9mHXKqS4dFMFhr1feFTl9a",
    title: "Meal Prep Senza Stress",
    amount: 890,
    files: [{ key: "meal", label: "Meal Prep Senza Stress", filename: "FitBooks_Meal_Prep_Senza_Stress.pdf" }]
  },
  mindful: {
    price_1UA96PKqS4dFMFhraUAnckmF
    title: "Mangiare con Più Consapevolezza",
    amount: 990,
    files: [{ key: "mindful", label: "Mangiare con Più Consapevolezza", filename: "FitBooks_Mangiare_con_Piu_Consapevolezza.pdf" }]
  },
  bundle: {
    priceId: "price_1U9mHhKqS4dFMFhrFScz4hCx",
    title: "FitBooks — Bundle Completo",
    amount: 2490,
    files: [
      { key: "habits", label: "21 Giorni di Abitudini Sane", filename: "FitBooks_21_Giorni_di_Abitudini_Sane.pdf" },
      { key: "meal", label: "Meal Prep Senza Stress", filename: "FitBooks_Meal_Prep_Senza_Stress.pdf" },
      { key: "mindful", label: "Mangiare con Più Consapevolezza", filename: "FitBooks_Mangiare_con_Piu_Consapevolezza.pdf" }
    ]
  }
};

const BY_PRICE = Object.fromEntries(Object.entries(PRODUCTS).map(([key, value]) => [value.priceId, { key, ...value }]));
const FILES = Object.fromEntries(PRODUCTS.bundle.files.map(f => [f.key, f]));

module.exports = { PRODUCTS, BY_PRICE, FILES };
