import jwt from "jsonwebtoken";

const verificarJWT = (req, res, next) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({ mensaje: "No hay token" });
    }

    const payload = jwt.verify(token, process.env.SECRETJWT);

    // Inyectamos datos en la request
    req.usuarioId = payload.uid;
    req.rol = payload.rol;
    req.usuario = payload;

    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

export default verificarJWT;
