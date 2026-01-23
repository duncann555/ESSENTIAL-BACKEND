import { MercadoPagoConfig, Preference } from "mercadopago";
import Pedido from "../models/pedido.js";

/* ======================================================
   CONFIGURACIÓN MERCADO PAGO
====================================================== */

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

/* ======================================================
   CREAR PREFERENCIA DE MERCADO PAGO
   - Recibe un pedidoId
   - Usa los productos del pedido
   - Guarda preferenceId en el pedido
====================================================== */

export const crearPreferencia = async (req, res) => {
  try {
    const { pedidoId } = req.body;

    if (!pedidoId) {
      return res.status(400).json({ mensaje: "Falta el ID del pedido" });
    }

    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    const body = {
      items: pedido.productos.map((p) => ({
        id: p.producto,
        title: p.nombre,
        quantity: p.cantidad,
        unit_price: p.precio,
        currency_id: "ARS",
      })),
      back_urls: {
        success: "http://localhost:5173/pago-exitoso",
        failure: "http://localhost:5173/carrito",
        pending: "http://localhost:5173/pago-pendiente",
      },
      auto_return: "approved",
      metadata: {
        pedidoId: pedido._id.toString(),
      },
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    // Guardamos el preferenceId dentro del pedido
    pedido.pago.preferenceId = result.id;
    await pedido.save();

    res.status(200).json({ id: result.id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al crear la preferencia de pago" });
  }
};
