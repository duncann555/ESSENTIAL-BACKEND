import mongoose, { Schema } from "mongoose";

const pedidoSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
      required: true,
    },

    productos: [
      {
        producto: {
          type: Schema.Types.ObjectId,
          ref: "producto",
          required: true,
        },
        nombre: String,
        precio: Number,
        cantidad: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    // ===============================
    // PAGO - MERCADO PAGO
    // ===============================
    pago: {
      proveedor: {
        type: String,
        default: "MercadoPago",
      },
      preferenceId: String,   // ID de la preferencia
      paymentId: String,      // ID real del pago
      estado: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      fechaPago: Date,
    },

    // ===============================
    // ENVÍO - ANDREANI
    // ===============================
    envio: {
      proveedor: {
        type: String,
        default: "Andreani",
      },
      provincia: String,
      ciudad: String,
      domicilio: String,
      codigoPostal: String,
      trackingId: String,
      estado: {
        type: String,
        enum: ["Pendiente", "Despachado", "Entregado"],
        default: "Pendiente",
      },
      costo: {
        type: Number,
        default: 0,
      },
    },

    // ===============================
    // ESTADO GENERAL DEL PEDIDO
    // ===============================
    estadoPedido: {
      type: String,
      enum: [
        "En espera de pago",
        "Preparando envío",
        "Despachado",
        "Entregado",
        "Cancelado",
      ],
      default: "En espera de pago",
    },
  },
  { timestamps: true }
);

export default mongoose.model("pedido", pedidoSchema);
