const mongoose = require("mongoose");
const client = mongoose
  .connect("mongodb+srv://Snowman28:Snow280599.@cluster0.6eb16gz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("DB Conectada"))
  .catch((error) => {
    console.log(error);
  });

module.exports = client;
