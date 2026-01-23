import { Router } from "express";
import {
  crearProducto,
  listarProductos,
  obtenerProductoID,
  editarProducto,
  eliminarProducto,
  filtrarProductoNombre,
  cambiarEstadoProducto,
} from "../controllers/productos.controllers.js";

import verificarJWT from "../middlewares/verificarJWT.js";
import { EsAdmin } from "../middlewares/verificarRoles.js";
import upload from "../helpers/upload.js";
import errorMulter from "../middlewares/ErrorMulter.js";
import validacionProducto from "../middlewares/validacionProducto.js";
import validacionEstadoProducto from "../middlewares/validacionEstadoProducto.js";
import validacionID from "../middlewares/validacionID.js";

const router = Router();

/* Público */
router.get("/", listarProductos);
router.get("/buscar", filtrarProductoNombre);
router.get("/:id", validacionID, obtenerProductoID);

/* Admin */
router.post(
  "/",
  verificarJWT,
  EsAdmin,
  upload.single("imagenUrl"),
  errorMulter,
  validacionProducto,
  crearProducto
);

router.put(
  "/:id",
  verificarJWT,
  EsAdmin,
  validacionID,
  upload.single("imagenUrl"),
  errorMulter,
  validacionProducto,
  editarProducto
);

router.patch(
  "/:id",
  verificarJWT,
  EsAdmin,
  validacionID,
  validacionEstadoProducto,
  cambiarEstadoProducto
);

router.delete(
  "/:id",
  verificarJWT,
  EsAdmin,
  validacionID,
  eliminarProducto
);

export default router;
