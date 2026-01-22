import { Router } from "express";
import { crearPreferencia } from "../controllers/pagos.controllers.js";
import verificarToken from "../middlewares/verificarToken.js";

const router = Router();

// Usamos el middleware que ya tenés para asegurar que solo usuarios logueados paguen
router.post("/checkout", verificarToken, crearPreferencia);

export default router;