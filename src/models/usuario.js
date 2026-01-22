import mongoose, { Schema } from "mongoose";

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true, // Guarda siempre en minúsculas para evitar duplicados por capitalización
      validate: {
        validator: (valor) => {
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(valor);
        },
        message: "El formato del email no es válido",
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      // Nota: La validación de fuerza de pass suele hacerse en el Frontend.
      // En el Schema, el password será un Hash (encriptado), por lo que la regex 
      // original aquí fallaría al intentar validar el hash largo.
    },
    rol: {
      type: String,
      required: true,
      enum: ["Administrador", "Usuario"],
      default: "Usuario",
    },
    estado: {
      type: String,
      required: true,
      enum: ["Activo", "Pendiente", "Suspendido"],
      default: "Activo",
    },
    telefono: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Usuario = mongoose.model("usuario", usuarioSchema);

export default Usuario;