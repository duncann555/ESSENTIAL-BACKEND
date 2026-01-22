import { body } from "express-validator";
import resultadoValidacion from "./resultadoValidacion.js";
import Usuario from "../models/usuario.js";

const validacionLogin = [
  body("email")
    .notEmpty()
    .withMessage("El email es un dato obligatorio")
    .isEmail()
    .withMessage("El email ingresado no es valido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es un dato obligatorio")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe contener minimo 8 caracteres"),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionLogin;
