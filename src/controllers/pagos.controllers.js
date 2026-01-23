import { MercadoPagoConfig, Preference } from "mercadopago";
import Pedido from "../models/pedido.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

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

    // Definimos la URL base según el entorno
    const frontUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const body = {
      items: pedido.productos.map((p) => ({
        id: p.producto.toString(), // Convertimos ObjectId a String por seguridad
        title: p.nombre,
        quantity: Number(p.cantidad),
        unit_price: Number(p.precio),
        currency_id: "ARS",
      })),
      back_urls: {
        success: `${frontUrl}/pago-exitoso`,
        failure: `${frontUrl}/carrito`,
        pending: `${frontUrl}/pago-pendiente`,
      },
      auto_return: "approved",
      metadata: {
        pedidoId: pedido._id.toString(),
      },
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    // Guardamos la referencia
    pedido.pago.preferenceId = result.id;
    await pedido.save();

    res.status(200).json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la preferencia de pago" });
  }
};