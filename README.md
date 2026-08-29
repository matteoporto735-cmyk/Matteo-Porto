# FitBooks 

Storefront statico per ebook PDF con catalogo, carrello, checkout dedicato e pagina di conferma ordine.

## Avvio locale
Apri `index.html` nel browser. Il flusso demo funziona senza server:
1. aggiungi uno o più ebook al carrello;
2. apri il checkout;
3. inserisci email e consensi;
4. conferma l'ordine demo;
5. visualizza la pagina di conferma.

## Importante: pagamenti reali
Il progetto NON addebita ancora denaro. Per vendere davvero bisogna collegare un provider come Stripe Checkout tramite backend/serverless function. Non inserire mai chiavi segrete Stripe nel JavaScript pubblico del browser.

Flusso consigliato:
- browser -> endpoint server `/create-checkout-session`;
- server -> crea Stripe Checkout Session con prodotti/prezzi validati lato server;
- Stripe -> pagamento;
- webhook Stripe -> conferma pagamento;
- server -> genera link temporaneo/firmato per scaricare il PDF;
- email -> invia ricevuta e link al cliente.

## Protezione degli ebook
Non mettere i PDF acquistabili nella cartella pubblica del sito. Conservali in storage privato e rilascia link temporanei solo dopo che il webhook del provider ha confermato il pagamento.

## Prima della pubblicazione
- sostituisci prodotti, prezzi e testi demo con quelli reali;
- collega Stripe o altro provider di pagamento;
- configura email transazionali e download protetti;
- inserisci i dati legali/fiscali richiesti per la tua attività e il Paese di vendita;
- fai verificare privacy, cookie, termini, recesso e fiscalità da un professionista;
- fai revisionare da un professionista qualificato eventuali contenuti nutrizionali o sanitari.

## File principali
- `index.html` — storefront
- `checkout.html` — checkout
- `success.html` — conferma ordine
- `styles.css` — design responsive
- `app.js` — catalogo e carrello
- `checkout.js` — riepilogo e ordine demo
- `success.js` — conferma ordine
- `legal.html` — bozze informative
- `ads.txt` — copy pubblicitario
