import express from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";
import "dotenv/config";

const app = express();

app.use(cors("*"));
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use("/api", routes);

app.listen(process.env.PORT || 3001, () => {
  console.log(". Servidor conectado");
  connectDB()
});
