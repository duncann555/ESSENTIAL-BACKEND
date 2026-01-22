import { Router } from "express";
import {
  actualizarUsuario,
  cambiarEstadoUsuario,
  crearUsuario,
  eliminarUsuario,
  listarUsuarios,
  login,
  obtenerUsuarioID,
} from "../controllers/usuarios.controllers.js";
import validacionUsuarios from "../middlewares/validacionUsuarios.js";
import validacionLogin from "../middlewares/validacionLogin.js";
import verificarJWT from "../middlewares/verificarToken.js";
import { EsAdmin } from "../middlewares/verificarRoles.js";
import validarEstadoUsuario from "../middlewares/validarEstadoUsuario.js";
import validacionEdicionUsuario from "../middlewares/validacionEdicionUsuario.js";
import validacionCambioEstado from "../middlewares/validacionCambioEstado.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();

router
  .route("/")
  .post(validacionUsuarios, crearUsuario)
  .get(verificarJWT, EsAdmin, listarUsuarios);
router
  .route("/:id")
  .put(
    verificarJWT,
    EsAdmin,
    validacionID,
    validacionEdicionUsuario,
    actualizarUsuario,
  )
  .patch(
    verificarJWT,
    EsAdmin,
    validacionID,
    validarEstadoUsuario,
    cambiarEstadoUsuario,
  )
  .get(verificarJWT, validacionID, obtenerUsuarioID)
  .delete(verificarJWT, EsAdmin, validacionID, eliminarUsuario);
router.route("/login").post(validacionLogin, login);

export default router;
