const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const client = require("./config/db.js");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use("/api", routes);

async function wakeUp() {
  try {
    const API_URL = process.env.API_URL;
    console.log("Haciendo request a la API");
    const res = await fetch(`${API_URL}/api/ticket/allTickets`);
    const data = await res.json();
    console.log("Se ha realizado el request a la API", data);
  } catch (error) {
    console.log(error);
  }
}

setInterval(() => {
  wakeUp()
}, 60000);

app.listen(3001, () => {
  console.log("Servidor conectado en el puerto 3001");
});
