import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Pedido from "../models/pedido.js";

const validacionCambioEstado = [
  body("estado")
    .optional()
    .isIn(["Pendiente", "Aprobado", "Rechazado", "Enviado"])
    .withMessage("Estado no valido"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionCambioEstado;
