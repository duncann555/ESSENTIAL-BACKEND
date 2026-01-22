export const EsAdmin = (req, res, next) => {
  if (!req.usuario)
    return res.status(401).json({ mensaje: "Usuario no autenticado" });

  if (!req.usuario.rol.includes("Administrador")) {
    return res
      .status(403)
      .json({ mensaje: "Acceso bloqueado no posee permisos de administrador" });
  }
  next();
};
