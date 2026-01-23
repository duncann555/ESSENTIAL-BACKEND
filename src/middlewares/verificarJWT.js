import jwt from "jsonwebtoken";

const verificarJWT = (req, res, next) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({ mensaje: "No hay token en la petición" });
    }

    const payload = jwt.verify(token, process.env.SECRET_JWT);

    // Guardamos los datos decodificados en la request para usarlos después
    req.usuarioId = payload.uid; // ID para buscar en base de datos
    req.rol = payload.rol;       // ROL para verificar permisos rapido
    req.email = payload.email;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ mensaje: "El token no es válido" });
  }
};

export default verificarJWT;