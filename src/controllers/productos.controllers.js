import { json } from "express";
import Producto from "../models/producto.js";
import subirImagenCloudinary from "../helpers/cloudinaryUploader.js";
import { controlarStock } from "../helpers/controlarStock.js";
import Pedido from "../models/pedido.js";

export const crearProducto = async (req, res) => {
  try {
    let imagen_url = "";

    if (req.file) {
      const resultado = await subirImagenCloudinary(req.file.buffer);
      imagen_url = resultado.secure_url;
    } else {
      imagen_url =
        "https://www.shutterstock.com/image-illustration/vintage-monochrome-broken-wireless-joystick-600nw-1641964507.jpg";
    }

    const nuevoProducto = new Producto({ ...req.body, imagenUrl: imagen_url });
    await nuevoProducto.save();

    res.status(201).json({ mensaje: "Producto creado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al crear el producto" });
  }
};

export const listarProductos = async (req, res) => {
  try {
    const respuesta = await Producto.find();

    if (!respuesta) {
      return res.status(404).json({ json: "No hay productos para listar" });
    }
    res.status(200).json(respuesta);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al listar los productos" });
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
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al eliminar el producto" });
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
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al obtener el producto" });
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
      const resultado = await subirImagenCloudinary(req.file.buffer);
      productoActualizado.imagenUrl = resultado.secure_url;
    }

    Object.assign(producto, productoActualizado);

    controlarStock(producto);

    await producto.save();

    res.status(200).json({
      mensaje: "Producto actualizado correctamente",
      producto: producto,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al editar el producto" });
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
    res.status(500).json({ mensaje: "Ocurrio un error al filtrar productos" });
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

    res
      .status(200)
      .json({ mensaje: "Estado actualizado exitosamente", producto });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al obtener el producto" });
  }
};
