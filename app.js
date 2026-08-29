const products = [
  {
    id: "habits",
    title: "21 Giorni di Abitudini Sane",
    price: 9.90,
    image: "assets/21-giorni.jpg",
    desc: "Un percorso pratico di 21 giorni per costruire routine più sane e sostenibili."
  },
  {
    id: "meal",
    title: "Meal Prep Senza Stress",
    price: 8.90,
    image: "assets/meal-prep.jpg",
    desc: "Pianifica e prepara i pasti della settimana con un metodo semplice e flessibile."
  },
  {
    id: "mindful",
    title: "Mangiare con Più Consapevolezza",
    price: 9.90,
    image: "assets/consapevolezza.jpg",
    desc: "Strumenti pratici per riconoscere fame, sazietà e automatismi con maggiore attenzione."
  },
  {
    id: "bundle",
    title: "FitBooks — Bundle Completo",
    price: 24.90,
    image: "assets/bundle.jpg",
    desc: "Tutti e tre gli ebook FitBooks in un unico acquisto a prezzo speciale.",
    bundle: true
  }
];

let cart = JSON.parse(localStorage.getItem("fitbooksCart") || "[]");
const money = n => new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format(n);

function renderProducts(){
  document.getElementById("productGrid").innerHTML = products.map(p => `
    <article class="product ${p.bundle ? "bundle-product" : ""}">
      <img class="product-cover-image" src="${p.image}" alt="Copertina ${p.title}" loading="lazy">
      <div class="product-body">
        ${p.bundle ? '<span class="bundle-tag">RISPARMIA €3,80</span>' : ''}
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          <div><button class="add-btn" onclick="addToCart('${p.id}')">Aggiungi</button> <button class="add-btn" onclick="buyNow('${p.id}', this)">Compra ora</button></div>
        </div>
      </div>
    </article>
  `).join("");
}

async function startCheckout(ids, button){
  if(button){ button.disabled = true; button.textContent = "Apertura…"; }
  try{
    const response = await fetch("/api/create-checkout-session", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({items:ids})
    });
    const data = await response.json();
    if(!response.ok || !data.url) throw new Error(data.error || "Checkout non disponibile");
    window.location.href = data.url;
  }catch(err){
    showToast(err.message || "Errore nel checkout");
    if(button){ button.disabled = false; button.textContent = "Compra ora"; }
  }
}

function buyNow(id, button){ startCheckout([id], button); }

function addToCart(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  if(id === "bundle"){
    cart = [p];
    showToast("Bundle completo aggiunto");
  } else {
    cart = cart.filter(x => x.id !== "bundle");
    if(!cart.some(x => x.id === id)) cart.push(p);
    const singles = ["habits","meal","mindful"];
    if(singles.every(s => cart.some(x => x.id === s))){
      cart = [products.find(x => x.id === "bundle")];
      showToast("Hai tutti e 3: applicato il prezzo Bundle €24,90");
    } else showToast("Aggiunto al carrello");
  }
  saveCart();
}
function removeFromCart(id){ cart = cart.filter(x => x.id !== id); saveCart(); }
function saveCart(){ localStorage.setItem("fitbooksCart", JSON.stringify(cart)); renderCart(); }
function renderCart(){
  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartItems").innerHTML = cart.length
    ? cart.map(p => `<div class="cart-item"><div><strong>${p.title}</strong><br><small>PDF digitale</small></div><div><strong>${money(p.price)}</strong><br><button class="remove" onclick="removeFromCart('${p.id}')">Rimuovi</button></div></div>`).join("")
    : "<p>Il carrello è vuoto.</p>";
  document.getElementById("cartTotal").textContent = money(cart.reduce((s,p)=>s+p.price,0));
}
function openCart(){ document.getElementById("cartDrawer").classList.add("open"); document.getElementById("overlay").classList.add("show"); }
function closeCart(){ document.getElementById("cartDrawer").classList.remove("open"); document.getElementById("overlay").classList.remove("show"); }
function showToast(msg){ const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"),2400); }

document.getElementById("cartButton").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("overlay").onclick = closeCart;
document.getElementById("checkoutBtn").onclick = function(){
  if(!cart.length) return showToast("Aggiungi almeno un ebook");
  startCheckout(cart.map(x => x.id), this);
};
renderProducts();
renderCart();
