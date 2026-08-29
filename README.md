# FitBooks — checkout Stripe + consegna protetta

Questa versione è pronta per essere pubblicata su Vercel (o adattata a un hosting Node/serverless equivalente).

## Cosa è già collegato
- Stripe Checkout creato lato server: nessuna chiave segreta nel browser.
- Prezzi LIVE FitBooks già mappati nel server.
- Qualsiasi combinazione di 1 o 2 ebook è acquistabile.
- Se il cliente seleziona tutti e 3, viene applicato automaticamente il Bundle da €24,90.
- Dopo il pagamento Stripe reindirizza a `success.html?session_id={CHECKOUT_SESSION_ID}`.
- La pagina verifica il pagamento direttamente con Stripe prima di mostrare i download.
- I PDF sono nella cartella privata del server, non nel sito pubblico.
- I download usano token HMAC temporanei (1 ora).
- Webhook opzionale pronto per inviare via email il link di consegna usando Resend.

## Variabili ambiente obbligatorie
Copia `.env.example` nelle variabili ambiente dell'hosting e imposta:

- `STRIPE_SECRET_KEY`: chiave segreta Stripe LIVE.
- `SITE_URL`: dominio pubblico, per esempio `https://www.fitbooks.com`.
- `DOWNLOAD_SIGNING_SECRET`: stringa casuale lunga (almeno 32+ caratteri).

Non inserire mai `STRIPE_SECRET_KEY` in HTML, `app.js`, GitHub pubblico o altri file frontend.

## Email automatica (consigliata)
Per inviare anche un'email dopo l'acquisto:
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `FROM_EMAIL`

Crea in Stripe un webhook che punti a:
`https://TUO-DOMINIO/api/stripe-webhook`

e abilita almeno l'evento `checkout.session.completed`.

## Pubblicazione su Vercel
1. Carica questa cartella in un progetto Vercel.
2. Aggiungi le variabili ambiente.
3. Pubblica.
4. Collega il dominio.
5. Esegui prima un test con chiavi TEST e prezzi TEST; solo dopo passa alle chiavi LIVE.

## Nota fiscale
La configurazione attuale non abilita automaticamente Stripe Tax. Prima del lancio internazionale, verifica IVA e adempimenti per contenuti digitali con il tuo commercialista e configura la strategia fiscale appropriata.
