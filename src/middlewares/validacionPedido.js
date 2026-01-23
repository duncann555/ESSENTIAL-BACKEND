import { check } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionPedido = [
  check("productos")
    .isArray({ min: 1 })
    .withMessage("El pedido debe contener al menos un producto"),
  
  check("productos.*.producto")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio"),
    
  check("productos.*.cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un entero mayor a 0"),

  // Validamos el objeto 'envio' embebido
  check("envio.provincia")
    .notEmpty()
    .withMessage("La provincia es obligatoria"),
    
  check("envio.ciudad")
    .notEmpty()
    .withMessage("La ciudad es obligatoria"),
    
  check("envio.domicilio")
    .notEmpty()
    .withMessage("El domicilio es obligatorio"),
    
  check("envio.codigoPostal")
    .notEmpty()
    .withMessage("El código postal es obligatorio"),

  resultadoValidacion,
];

export default validacionPedido;