import Producto from "../models/producto.js";

export const controlarStock = (producto) => {
  if (producto.stock <= 0) {
    producto.estado = "Inactivo";
  } else {
    producto.estado = "Activo";
  }
};
