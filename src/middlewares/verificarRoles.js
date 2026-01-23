export const EsAdmin = (req, res, next) => {
  if (req.rol !== "Administrador") {
    return res
      .status(403)
      .json({ mensaje: "Acceso solo para administradores" });
  }
  next();
};
