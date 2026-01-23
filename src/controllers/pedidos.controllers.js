import Pedido from "../models/pedido.js";
import Producto from "../models/producto.js";

/* ======================================================
   1️⃣ CREAR PEDIDO
====================================================== */

export const crearPedido = async (req, res) => {
  try {
    const { productos, envio } = req.body;
    const usuarioId = req.usuarioId;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: "Pedido vacío" });
    }

    let total = 0;
    const productosFinal = [];

    for (const item of productos) {
      const productoBD = await Producto.findById(item.producto);

      if (!productoBD) {
        return res.status(404).json({ mensaje: "Producto no existe" });
      }

      if (productoBD.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${productoBD.nombre}`,
        });
      }

      total += productoBD.precio * item.cantidad;

      productosFinal.push({
        producto: productoBD._id,
        nombre: productoBD.nombre,
        precio: productoBD.precio,
        cantidad: item.cantidad,
      });
    }

    const pedido = new Pedido({
      usuario: usuarioId,
      productos: productosFinal,
      total,
      envio,
      pago: { estado: "pending" },
      estadoPedido: "En espera de pago",
    });

    await pedido.save();

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedidoId: pedido._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el pedido" });
  }
};

/* ======================================================
   2️⃣ LISTAR PEDIDOS
====================================================== */

export const listarPedidos = async (req, res) => {
  try {
    const filtro =
      req.rol === "Administrador" ? {} : { usuario: req.usuarioId };

    const pedidos = await Pedido.find(filtro)
      .populate("usuario", "nombre apellido email")
      .sort({ createdAt: -1 });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
};

/* ======================================================
   3️⃣ OBTENER PEDIDO POR ID
====================================================== */

export const obtenerPedidoID = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("usuario", "nombre apellido email");

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener pedido" });
  }
};

/* ======================================================
   4️⃣ ACTUALIZAR ESTADO DEL PEDIDO (ADMIN)
====================================================== */

export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { estadoPedido, trackingId } = req.body;

    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    if (estadoPedido) {
      pedido.estadoPedido = estadoPedido;
    }

    if (trackingId) {
      pedido.envio.trackingId = trackingId;
      pedido.envio.estado = "Despachado";
    }

    await pedido.save();

    res.status(200).json({
      mensaje: "Pedido actualizado correctamente",
      pedido,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar pedido" });
  }
};

/* ======================================================
   5️⃣ ELIMINAR PEDIDO
====================================================== */

export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json({ mensaje: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar pedido" });
  }
};

/* ======================================================
   6️⃣ LISTAR PEDIDOS DEL USUARIO LOGUEADO
====================================================== */

export const listarPedidosUsuario = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuarioId }).sort({
      createdAt: -1,
    });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener historial de pedidos" });
  }
};
