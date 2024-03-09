const mongoose = require("mongoose");
require("dotenv").config();

async function connectToDatabase() {
  try {
    const client = await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Conectada");
    return client;
  } catch (error) {
    console.log(error);
  }
}

const client = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Conectada"))
  .catch((error) => {
    console.log(error);
  });

module.exports = { connectToDatabase, client };
