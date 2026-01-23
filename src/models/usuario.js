import mongoose, { Schema } from "mongoose";

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // SIEMPRE hash
    },
    rol: {
      type: String,
      enum: ["Administrador", "Usuario"],
      default: "Usuario",
    },
    estado: {
      type: String,
      enum: ["Activo", "Suspendido"],
      default: "Activo",
    },
    telefono: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("usuario", usuarioSchema);
