import mongoose, { Schema } from "mongoose";

const productoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    categoria: {
      type: String,
      required: true,
      enum: [
        "Tinturas Madres",
        "Aceites Esenciales",
        "Cosmética Natural",
        "Fitoterapia",
        "Infusiones",
      ],
    },
    descripcion: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 1000,
    },
    precio: {
      type: Number,
      required: true,
      min: 1,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    imagenUrl: {
      type: String,
      required: true,
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
    oferta: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("producto", productoSchema);
