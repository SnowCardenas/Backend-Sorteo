import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://Snowman28:Snow280599.@cluster0.6eb16gz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Conectado a la base de datos");
    return true;
  } catch (error) {
    console.log("Error al conectar a la base de datos");
    console.log(error);
    return false;
  }
}


const client = mongoose.connect("mongodb+srv://Snowman28:Snow280599.@cluster0.6eb16gz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("DB Conectada"))
  .catch((error) => {
    console.log("Error al conectar a la base de datos");
    console.log(error);
  });

export default client;
