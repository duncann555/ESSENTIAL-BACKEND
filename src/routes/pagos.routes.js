import { Router } from "express";
import { crearPreferencia } from "../controllers/pagos.controllers.js";
import verificarJWT from "../middlewares/verificarJWT.js";

const router = Router();

// Crear preferencia de MercadoPago
router.post("/checkout", verificarJWT, crearPreferencia);

export default router;
