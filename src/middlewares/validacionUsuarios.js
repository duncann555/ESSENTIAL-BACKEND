import { body } from "express-validator";
import Usuario from "../models/usuario.js";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionUsuarios = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es un dato obligatorio")
    .isLength({ min: 3, max: 50 })
    .withMessage("El nombre debe contener entre 3 y 50 caracteres"),
  body("apellido")
    .notEmpty()
    .withMessage("El apellido es un dato obligatorio")
    .isLength({ min: 3, max: 50 })
    .withMessage("El apellido debe contener entre 3 y 50 caracteres"),
  body("dni")
    .notEmpty()
    .withMessage("El DNI es un dato obligatorio")
    .isNumeric()
    .withMessage("El DNI debe contener solo numeros")
    .isLength({ min: 8, max: 8 })
    .withMessage("El DNI debe contener exactemente 8 digitos"),
  body("telefono")
    .notEmpty()
    .withMessage("El telefono es un dato obligatorio")
    .isNumeric()
    .withMessage("El telefono es un dato numerico")
    .isLength({ min: 8, max: 15 })
    .withMessage("El telefono debe contener entre 8 y 15 digitos"),
  body("email")
    .notEmpty()
    .withMessage("El email es un dato obligatorio")
    .isEmail()
    .withMessage("El email ingresado no es valido")
    .normalizeEmail()
    .custom(async (valor) => {
      const correoExistente = await Usuario.findOne({ email: valor });

      if (correoExistente) {
        throw new Error("El correo ingresado ya existe");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es un dato obligatorio")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe contener al menor 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .withMessage(
      "La contraseña debe incluir una letra minuscula, una mayuscula, un numero y un caracter especial"
    ),
  body("rol")
    .optional()
    .isIn(["Administrador", "Usuario"])
    .withMessage("El rol debe ser 'Administrador' o 'Usuario'"),
  body("estado")
    .optional()
    .isIn(["Activo", "Pendiente", "Suspendido"])
    .withMessage(
      `El estado debe ser uno de los siguientes: "Activo", "Pendiente", "Suspendido"`
    ),
  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionUsuarios;
