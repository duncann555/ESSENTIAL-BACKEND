import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Producto from "../models/producto.js";

const validacionProducto = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "El nombre del producto debe contener entre 3 y 100 caracteres"
    )
    .custom(async (valor, { req }) => {
      const productoExistente = await Producto.findOne({
        nombre: valor,
      });
      if (!productoExistente) {
        return true;
      }
      if (
        req.params?.id &&
        productoExistente._id.toString() === req.params.id
      ) {
        return true;
      }
      throw new Error("Ya existe un producto con este nombre");
    }),
  body("categoria")
    .notEmpty()
    .withMessage("La categoria es un dato obligatorio")
    .isIn([
      "Juegos de PC",
      "Juegos de PlayStation",
      "Juegos de Xbox",
      "Juegos de Nintendo",
      "Accesorios",
      "Consolas",
    ])
    .withMessage(
      `La categoria debe ser una de las siguientes: "Juegos de PC", "Juegos de PlayStation", "Juegos de Xbox", "Juegos de Nintendo", "Accesorios", "Consolas"`
    ),
  body("stock")
    .notEmpty()
    .withMessage("El stock es un dato obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser entero y mayor o igual a 0"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion es un dato obligatorio")
    .isLength({ min: 10, max: 250 })
    .withMessage("La descripcion debe contener entre 10 y 250 caracteres"),
  body("estado")
    .optional()
    .isIn(["Activo", "Inactivo"])
    .withMessage("El estado debe ser 'activo' o 'inactivo'"),
  body("precio")
    .notEmpty()
    .withMessage("El precio es un dato obligatorio")
    .isInt({ min: 100, max: 1000000 })
    .withMessage("El precio debe estar entre 100 y 1.000.000"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionProducto;
