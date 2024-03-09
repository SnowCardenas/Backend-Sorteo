const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const app = express();

app.use(cors("*"));
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

app.listen(process.env.PORT, () => {
  console.log("Servidor conectado andando");
});
