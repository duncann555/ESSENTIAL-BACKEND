import { body } from "express-validator";
import Usuario from "../models/usuario.js";
import resultadoValidacion from "./resultadoValidacion.js";

const validacionEdicionUsuario = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es un dato obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe contener entre 3 y 50 caracteres"),

  body("apellido")
    .notEmpty()
    .withMessage("El apellido es un dato obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe contener entre 3 y 50 caracteres"),

  // AGREGAMOS VALIDACIÓN DE DNI (Igual que en Registro)
  body("dni")
    .notEmpty()
    .withMessage("El DNI es un dato obligatorio")
    .isNumeric()
    .withMessage("El DNI debe contener solo numeros")
    .isLength({ min: 8, max: 8 }) 
    .withMessage("El DNI debe contener entre 7 y 8 dígitos"),

  // AGREGAMOS VALIDACIÓN DE TELEFONO (Igual que en Registro)
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
    .custom(async (valor, { req }) => {
      const id_Usuario = req.params.id;

      // Buscamos si existe OTRO usuario con este email (excluyendo al actual)
      const correoExistente = await Usuario.findOne({
        email: valor,
        _id: { $ne: id_Usuario },
      });

      if (correoExistente) {
        throw new Error("El correo ingresado ya existe");
      }
      return true;
    }),

  body("rol")
    .optional()
    .isIn(["Administrador", "Usuario"]) // Respetamos las mayúsculas
    .withMessage("El rol debe ser 'Administrador' o 'Usuario'"),

  (req, res, next) => resultadoValidacion(req, res, next),
];

export default validacionEdicionUsuario;