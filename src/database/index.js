import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("Nueva conexion realizada con MongoDB Atlas");
} catch (error) {
  console.log("Se ha generado un error: " + error);
}