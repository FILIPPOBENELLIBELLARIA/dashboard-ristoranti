const express = require("express");

const fs = require("fs");

const multer = require("multer");

const app = express();

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "gallery/");

  },

  filename: function (req, file, cb) {

    cb(null, Date.now() + "-" + file.originalname);

  }

});

const upload = multer({ storage: storage });

const uploadMenu = multer({

  storage: multer.diskStorage({

    destination: function (req, file, cb) {

      cb(null, "menu-upload/");

    },

    filename: function (req, file, cb) {

      cb(null, "menu-" + file.originalname);

    }

  })

});

app.use(express.json());

app.use(express.static(__dirname));

app.post("/salva-menu", (req, res) => {

  const nuovoMenu = req.body.menu;

  const dati = JSON.parse(
    fs.readFileSync("testo.json", "utf8")
  );

  dati.menu = nuovoMenu;

  fs.writeFileSync(
    "testo.json",
    JSON.stringify(dati, null, 2)
  );

  res.send("Menu salvato!");

});

app.post("/salva-menu-giorno", (req, res) => {

  const nuovoMenu = req.body.menu;

  fs.writeFileSync("menu-giorno.txt", nuovoMenu);

  res.send("Menu del giorno salvato!");

});

app.post("/salva-benvenuto", (req, res) => {

  const testo = req.body.testo;

  fs.writeFileSync("benvenuto.txt", testo);

  res.send("Benvenuto salvato!");

});
app.get("/menu", (req, res) => {

  const menu = fs.readFileSync("menu.txt", "utf8");

  res.send(menu);

});

app.post("/upload-foto", upload.single("foto"), (req, res) => {

  res.send("Foto caricata!");

});

app.post("/upload-menu", uploadMenu.single("menu"), (req, res) => {

  res.send("Menu caricato!");

});

app.get("/lista-foto", (req, res) => {

  const files = fs.readdirSync("gallery");

  res.json(files);

});

app.get("/lista-menu", (req, res) => {

  const files = fs.readdirSync("menu-upload");

  res.json(files);

});

app.delete("/elimina-foto/:nome", (req, res) => {

  const nomeFile = req.params.nome;

  fs.unlinkSync("gallery/" + nomeFile);

  res.send("Foto eliminata!");

});

app.delete("/elimina-menu/:nome", (req, res) => {

  const nomeFile = req.params.nome;

  fs.unlinkSync("menu-upload/" + nomeFile);

  res.send("Menu eliminato!");

});

app.post("/salva-json", (req, res) => {

  fs.writeFileSync(
    "testo.json",
    JSON.stringify(req.body, null, 2)
  );

  res.send("JSON salvato!");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
console.log("Server avviato!");
});
