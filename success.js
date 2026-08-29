const params = new URLSearchParams(location.search);
const sessionId = params.get("session_id");
const successText = document.getElementById("successText");
const orderBox = document.getElementById("successOrder");
const downloadArea = document.getElementById("downloadArea");
const money = cents => new Intl.NumberFormat("it-IT",{style:"currency",currency:"EUR"}).format((cents||0)/100);

async function loadOrder(){
  if(!sessionId){
    successText.textContent = "Manca l'identificativo dell'ordine. Usa il link ricevuto dopo il pagamento.";
    return;
  }
  try{
    const response = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, { cache:"no-store" });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || "Pagamento non verificato");

    localStorage.removeItem("fitbooksCart");
    successText.textContent = data.email ? `Pagamento confermato per ${data.email}.` : "Pagamento confermato.";
    orderBox.hidden = false;
    orderBox.innerHTML = `<div><span>Totale pagato</span><strong>${money(data.amountTotal)}</strong></div>`;
    downloadArea.innerHTML = `<h2>Scarica i tuoi ebook</h2>${data.downloads.map(d => `<a class="btn primary full download-btn" href="${d.url}">Scarica ${d.label}</a>`).join("")}`;
  }catch(err){
    successText.textContent = err.message;
    downloadArea.innerHTML = `<p class="download-error">Se hai appena pagato, attendi qualche secondo e <button id="retryBtn" class="text-button">riprova</button>.</p>`;
    document.getElementById("retryBtn")?.addEventListener("click", loadOrder);
  }
}
loadOrder();
