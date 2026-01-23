import Producto from "../models/producto.js";
import subirImagenCloudinary from "../helpers/cloudinaryUploader.js";
import { controlarStock } from "../helpers/controlarStock.js";

export const crearProducto = async (req, res) => {
  try {
    let imagen_url = "https://placehold.co/600x400?text=Sin+Imagen";

    if (req.file) {
      // Usamos el helper que ya corregimos pasándole el req.file completo
      const resultado = await subirImagenCloudinary(req.file);
      imagen_url = resultado.secure_url; // URL segura de Cloudinary
    }

    // El modelo espera 'imagenUrl', el frontend también. Sincronizamos todo:
    const nuevoProducto = new Producto({ 
        ...req.body, 
        imagenUrl: imagen_url 
    });
    
    await nuevoProducto.save();
    res.status(201).json({ mensaje: "Producto creado exitosamente" });
  } catch (err) {
    console.error("Error detallado:", err);
    res.status(500).json({ mensaje: "Error al crear", error: err.message });
  }
};

export const listarProductos = async (req, res) => {
  try {
    const respuesta = await Producto.find();
    res.status(200).json(respuesta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al listar los productos" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al eliminar el producto" });
  }
};

export const obtenerProductoID = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al obtener el producto" });
  }
};

export const editarProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const productoActualizado = { ...req.body };

    if (req.file) {
      // CORRECCIÓN: Aquí también, pasamos 'req.file' entero
      const resultado = await subirImagenCloudinary(req.file);
      productoActualizado.imagenUrl = resultado.secure_url;
    }

    Object.assign(producto, productoActualizado);

    // Verificamos si existe la función antes de usarla
    if (typeof controlarStock === 'function') {
        controlarStock(producto);
    }

    await producto.save();

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: producto,
    });
  } catch (err) {
    console.error("Error en editarProducto:", err);
    res.status(500).json({ mensaje: "Ocurrió un error al editar el producto" });
  }
};

export const filtrarProductoNombre = async (req, res) => {
  try {
    const buscar = req.query.nombre || "";
    const productos = await Producto.find({
      nombre: { $regex: buscar, $options: "i" },
    });
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al filtrar productos" });
  }
};

export const cambiarEstadoProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    producto.estado = req.body.estado || producto.estado;
    await producto.save();
    res.status(200).json({ mensaje: "Estado actualizado exitosamente", producto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al cambiar estado" });
  }
};