import { body } from "express-validator";
import Producto from "../models/producto.js";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionEstadoProducto = [
  body("estado")
    .optional()
    .isIn(["Activo", "Inactivo"])
    .withMessage("El estado debe ser activo o incativo"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionEstadoProducto;
