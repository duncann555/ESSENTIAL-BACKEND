import Pedido from "../models/pedido.js";
import Producto from "../models/producto.js";

// ==========================================
// 1. CREAR PEDIDO (POST)
// ==========================================
export const crearPedido = async (req, res) => {
  try {
    const { productos, envio, pago, total } = req.body;
    const usuarioId = req.usuarioId; // Extraído de tu middleware verificarToken

    // Validaciones básicas
    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: "No hay productos en el pedido" });
    }
    if (!envio) {
      return res.status(400).json({ mensaje: "Faltan los datos de envío para Andreani" });
    }

    // Opcional: Validar stock y recalcular total en el servidor por seguridad
    let totalCalculado = 0;
    for (const item of productos) {
      const prodBD = await Producto.findById(item.productoId);
      if (!prodBD) {
        return res.status(404).json({ mensaje: `Producto ${item.nombre} no encontrado` });
      }
      // Verificamos stock disponible
      if (prodBD.stock < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para ${prodBD.nombre}` });
      }
      totalCalculado += prodBD.precio * item.cantidad;
    }

    const nuevoPedido = new Pedido({
      usuario: usuarioId,
      productos,
      total: total || totalCalculado, // Priorizamos el total calculado en el server
      envio,
      pago: pago || { status: "pending" },
      estadoPedido: "En espera de pago"
    });

    await nuevoPedido.save();

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedidoId: nuevoPedido._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el pedido" });
  }
};

// ==========================================
// 2. LISTAR PEDIDOS (GET)
// ==========================================
export const listarPedidos = async (req, res) => {
  try {
    // Si es Admin ve todos, si es Usuario solo los suyos
    const filtro = req.rol === "Administrador" ? {} : { usuario: req.usuarioId };

    const pedidos = await Pedido.find(filtro)
      .populate("usuario", "nombre apellido email") // Trae datos del cliente sin traer el password
      .sort({ createdAt: -1 });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar pedidos" });
  }
};

// ==========================================
// 3. OBTENER POR ID (GET)
// ==========================================
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
    res.status(500).json({ mensaje: "Error al obtener el pedido" });
  }
};

// ==========================================
// 4. ACTUALIZAR ESTADO (PATCH)
// ==========================================
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoPedido, trackingId, pagoStatus } = req.body;

    // Buscamos y actualizamos campos específicos
    const updateFields = {};
    if (estadoPedido) updateFields.estadoPedido = estadoPedido;
    if (trackingId) updateFields["envio.trackingId"] = trackingId;
    if (pagoStatus) updateFields["pago.status"] = pagoStatus;

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!pedidoActualizado) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json({
      mensaje: "Pedido actualizado con éxito",
      pedido: pedidoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar el pedido" });
  }
};

// ==========================================
// 5. ELIMINAR PEDIDO (DELETE)
// ==========================================
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.status(200).json({ mensaje: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar el pedido" });
  }
};

// Agregá esto en pedidos.controllers.js
export const listarPedidosUsuario = async (req, res) => {
  try {
    // req.usuarioId viene del middleware verificarToken
    const pedidos = await Pedido.find({ usuario: req.usuarioId })
      .sort({ createdAt: -1 });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener tu historial de pedidos" });
  }
};