import { inicioAdmin } from "../helpers/inicioAdmin.js";
import mongoose from "mongoose";

try {
  mongoose.connect(process.env.MONGODB).then(() => {
    console.info("BD CONECTADA CORRECTAMENTE");
  });

  inicioAdmin();

} catch (error) {
  console.error(error);
}

export default mongoose;