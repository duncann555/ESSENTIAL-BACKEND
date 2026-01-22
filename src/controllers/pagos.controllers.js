import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuramos Mercado Pago con tu Access Token (Debe ir en tu .env)
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

export const crearPreferencia = async (req, res) => {
  try {
    const { productos, envio } = req.body; // Recibimos el carrito y datos de envío del front

    const body = {
      items: productos.map(p => ({
        id: p._id,
        title: p.nombre,
        quantity: Number(p.cantidad),
        unit_price: Number(p.precio),
        currency_id: "ARS",
      })),
      back_urls: {
        success: "http://localhost:5173/pago-exitoso", // Tu ruta de React
        failure: "http://localhost:5173/carrito",
        pending: "http://localhost:5173/pago-pendiente",
      },
      auto_return: "approved",
      // Metadata es vital para que cuando MP nos avise del pago, sepamos qué pedido es
      metadata: { envio_info: envio } 
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    // Devolvemos el ID al frontend para que abra el checkout
    res.status(200).json({ id: result.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la preferencia de pago" });
  }
};