import mongoose, { Schema } from "mongoose";

const productoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minLength: 3,
      maxLength: 100,
      unique: true,
      trim: true, // Limpia espacios vacíos al principio y final
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: {
        values: [
          "Tinturas Madres",
          "Aceites Esenciales",
          "Cosmética Natural",
          "Fitoterapia",
          "Infusiones",
        ],
        message: "{VALUE} no es una categoría válida",
      },
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [1, "El precio mínimo es 1"],
      max: [1000000, "El precio máximo es 1.000.000"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      minLength: 10,
      maxLength: 1000, // Ampliamos para poder explicar beneficios naturales
    },
    imagenUrl: {
      type: String,
      required: [true, "La URL de la imagen es obligatoria"],
      // Dejamos la validación pero un poco más flexible para URLs de Cloudinary
      validate: {
        validator: (valor) => {
          return /^(https?:\/\/)/.test(valor);
        },
        message: "Debe ser una URL válida de imagen",
      },
    },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
    // CAMBIO CLAVE: Campo para tu carrusel de ofertas en el Frontend
    oferta: {
      type: Boolean,
      default: false,
    },
    fechaControl: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  }
);

const Producto = mongoose.model("producto", productoSchema);

export default Producto;