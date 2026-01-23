import { Router } from "express";
import {
  crearUsuario,
  login,
  listarUsuarios,
  obtenerUsuarioID,
  actualizarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario,
} from "../controllers/usuarios.controllers.js";

import verificarJWT from "../middlewares/verificarJWT.js";
import { EsAdmin } from "../middlewares/verificarRoles.js";
import validacionUsuarios from "../middlewares/validacionUsuarios.js";
import validacionLogin from "../middlewares/validacionLogin.js";
import validacionEdicionUsuario from "../middlewares/validacionEdicionUsuario.js";
import validarEstadoUsuario from "../middlewares/validarEstadoUsuario.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();

/* Público */
router.post("/", validacionUsuarios, crearUsuario);
router.post("/login", validacionLogin, login);

/* Admin */
router.get("/", verificarJWT, EsAdmin, listarUsuarios);

router.get("/:id", verificarJWT, validacionID, obtenerUsuarioID);

router.put(
  "/:id",
  verificarJWT,
  EsAdmin,
  validacionID,
  validacionEdicionUsuario,
  actualizarUsuario
);

router.patch(
  "/:id",
  verificarJWT,
  EsAdmin,
  validacionID,
  validarEstadoUsuario,
  cambiarEstadoUsuario
);

router.delete(
  "/:id",
  verificarJWT,
  EsAdmin,
  validacionID,
  eliminarUsuario
);

export default router;
