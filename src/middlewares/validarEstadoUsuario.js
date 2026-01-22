import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Usuario from "../models/usuario.js";

const validarEstadoUsuario = [
  body("estado")
    .optional()
    .isIn(["Activo", "Pendiente", "Suspendido"])
    .withMessage("El estado debe ser 'Activo', 'Pendiente' o 'Suspendido'"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validarEstadoUsuario;
