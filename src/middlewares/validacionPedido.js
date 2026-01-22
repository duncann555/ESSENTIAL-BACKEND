import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import mongoose from "mongoose";

const validacionPedido = [
  //Validaciones para detalle del pedido
  body("detallePedido.usuario")
    .notEmpty()
    .withMessage("El ID del usuario es un dato obligatorio"),
  body("detallePedido.provincia")
    .notEmpty()
    .withMessage("La provincia es un dato obligatorio")
    .isIn(["Buenos Aires", "Cordoba", "Salta", "Tucuman", "Neuquen"])
    .withMessage(
      `Provincia debe ser una se las siguientes: "Buenos Aires","Cordoba","Salta","Tucuman","Neuquen"`
    ),
  body("detallePedido.ciudad")
    .notEmpty()
    .withMessage("La ciudad es un dato obligatorio")
    .isLength({ min: 3, max: 50 })
    .withMessage("La ciudad debe contener entre 3 y 50 caracteres"),
  body("detallePedido.domicilio")
    .notEmpty()
    .withMessage("El domicilio es un dato obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El domicilio debe contener entre 3 y 100 caracteres"),
  body("detallePedido.codigoPostal")
    .notEmpty()
    .withMessage("El codigo postal es un dato obligatorio")
    .isLength({ min: 4, max: 8 })
    .withMessage("El codigo postal debe contener entre 4 y 8 caracteres"),
  body("detallePedido.cuotas")
    .notEmpty()
    .withMessage("Las cuotas a pagar son un dato obligatorio")
    .isIn([
      "Pago unico",
      "3 cuotas sin interes",
      "6 coutas sin interes",
      "12 cuotas sin interes",
    ]),
  //validaciones para pedido
  body("productos")
    .isArray({ min: 1 })
    .withMessage("El array debe contener al menos un producto"),
  body("productos.*.producto")
    .notEmpty()
    .withMessage("El ID del producto es obligatorio")
    .custom((valor) => {
      if (!mongoose.Types.ObjectId.isValid(valor)) {
        throw new Error("El ID no es valido");
      }
      return true;
    }),
  body("productos.*.cantidad")
    .notEmpty()
    .withMessage("La cantidad es obligatoria")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser mayor a 0"),
  body("estado")
    .optional()
    .isIn(["Pendiente", "Aprobado", "Rechazado", "Enviado"])
    .withMessage("El estado ingresado no es valido"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionPedido;
