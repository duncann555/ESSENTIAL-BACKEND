import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js"; // <--- CORREGIDO: Sin llaves
import Producto from "../models/producto.js";

export const validacionProducto = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre del producto debe contener entre 3 y 100 caracteres")
    .custom(async (valor, { req }) => {
      const productoExistente = await Producto.findOne({ nombre: valor });
      
      if (!productoExistente) return true;
      
      if (req.params.id && productoExistente._id.toString() === req.params.id) {
        return true;
      }
      
      throw new Error("Ya existe un producto con este nombre");
    }),

  body("categoria")
    .notEmpty()
    .withMessage("La categoría es un dato obligatorio")
    .isIn([
      "Tinturas Madres",
      "Aceites Esenciales",
      "Cosmética Natural",
      "Infusiones"
    ])
    .withMessage(
      'La categoría debe ser válida (Tinturas Madres, Aceites Esenciales, Cosmética Natural, Infusiones)'
    ),

  body("stock")
    .notEmpty()
    .withMessage("El stock es un dato obligatorio")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero mayor o igual a 0"),

  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es un dato obligatorio")
    .isLength({ min: 10, max: 1000 })
    .withMessage("La descripción debe contener entre 10 y 1000 caracteres"),

  body("estado")
    .optional()
    .isIn(["Activo", "Inactivo"])
    .withMessage("El estado debe ser 'Activo' o 'Inactivo'"),

  body("precio")
    .notEmpty()
    .withMessage("El precio es un dato obligatorio")
    .isNumeric()
    .withMessage("El precio debe ser un número válido")
    .custom((value) => {
        if(value >= 0 && value <= 1000000){
            return true;
        }
        throw new Error("El precio debe estar entre 0 y 1.000.000");
    }),

  (req, res, next) => resultadoValidacion(req, res, next),
];