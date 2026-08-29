const fs = require("fs");
const path = require("path");
const { FILES } = require("./catalog");
const { verifyToken } = require("./token");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("Metodo non consentito");
  if (!process.env.DOWNLOAD_SIGNING_SECRET) return res.status(500).send("Configurazione incompleta");

  try {
    const payload = verifyToken(req.query?.token, process.env.DOWNLOAD_SIGNING_SECRET);
    if (!payload || !FILES[payload.fileKey]) return res.status(403).send("Link non valido o scaduto");

    const file = FILES[payload.fileKey];
    const filePath = path.join(process.cwd(), "private", "ebooks", file.filename);
    if (!fs.existsSync(filePath)) return res.status(404).send("File non trovato");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${file.filename}"`);
    res.setHeader("Cache-Control", "private, no-store");
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error(err);
    return res.status(403).send("Link non valido");
  }
};
