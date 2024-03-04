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

app.use("/api", routes);

app.listen(3001, () => {
  console.log("Servidor conectado en el puerto 3001");
});
