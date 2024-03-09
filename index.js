const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const app = express();
require("dotenv").config();

app.use(cors("*"));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use("/api", routes);

app.listen(process.env.PORT || 3001, () => {
  console.log("Servidor conectado");
});
