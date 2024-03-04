const mongoose = require("mongoose");
require("dotenv").config();

const client = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Conectada"))
  .catch((error) => {
    console.log(error);
  });

module.exports = client;
