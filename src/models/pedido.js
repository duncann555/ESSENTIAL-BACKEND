import mongoose, { Schema } from "mongoose";

const pedidoSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "usuario", required: true },
    productos: [
      {
        productoId: { type: Schema.Types.ObjectId, ref: "producto" },
        nombre: String,
        precio: Number,
        cantidad: Number,
      }
    ],
    total: { type: Number, required: true },
    
    // DATOS DE ENVÍO - Conectado con Andreani
    envio: {
      metodo: { type: String, default: "Andreani" },
      provincia: { type: String, required: true },
      ciudad: { type: String, required: true },
      domicilio: { type: String, required: true },
      codigoPostal: { type: String, required: true },
      trackingId: { type: String }, // Aquí guardarás el número de Andreani
      costoEnvio: { type: Number, default: 0 }
    },

    // DATOS DE PAGO - Conectado con MercadoPago
    pago: {
      transactionId: { type: String }, // El payment_id que te da MP
      status: { 
        type: String, 
        enum: ["pending", "approved", "rejected", "in_process"], 
        default: "pending" 
      },
      metodo: { type: String, default: "Tarjeta" }
    },
    
    estadoPedido: {
      type: String,
      enum: ["En espera de pago", "Preparando envío", "Despachado", "Entregado", "Cancelado"],
      default: "En espera de pago",
    }
  },
  { timestamps: true }
);

const Pedido = mongoose.model("pedido", pedidoSchema);
export default Pedido;