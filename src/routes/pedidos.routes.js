import { Router } from "express";
import {
  crearPedido,
  listarPedidos,
  obtenerPedidoID,
  actualizarEstadoPedido,
  eliminarPedido,
  listarPedidosUsuario // Nueva función necesaria para el cliente
} from "../controllers/pedidos.controllers.js";

// Middlewares de validación y seguridad
import validacionPedido from "../middlewares/validacionPedido.js";
import validacionCambioEstado from "../middlewares/validacionCambioEstado.js";
import verificarJWT from "../middlewares/verificarToken.js";
import { EsAdmin } from "../middlewares/verificarRoles.js";

const router = Router();

// ==========================================
// RUTAS DE ACCESO GENERAL (Logueados)
// ==========================================

router.route("/")
  // El usuario crea su pedido (antes de ir a Mercado Pago)
  .post([verificarJWT, validacionPedido], crearPedido)
  
  // El Admin ve todos, el Usuario solo los suyos (Lógica interna del controller)
  .get([verificarJWT], listarPedidos);

// Nueva ruta: Para que el cliente vea su historial de compras en su perfil
router.get("/mis-pedidos", verificarJWT, listarPedidosUsuario);

// ==========================================
// RUTAS DE ADMINISTRACIÓN (Solo Admin)
// ==========================================

router.route("/:id")
  .get([verificarJWT, EsAdmin], obtenerPedidoID)
  
  // PATCH: Ideal para cambiar estados (Pendiente -> Pagado -> Despachado)
  .patch([verificarJWT, EsAdmin, validacionCambioEstado], actualizarEstadoPedido)
  
  // DELETE: Solo si el pedido fue cancelado o por error administrativo
  .delete([verificarJWT, EsAdmin], eliminarPedido);

export default router;