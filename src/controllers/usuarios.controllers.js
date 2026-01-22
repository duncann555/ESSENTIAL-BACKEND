import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";
import generarJWT from "../middlewares/generarJWT.js";

export const crearUsuario = async (req, res) => {
  try {
    const saltos = bcrypt.genSaltSync(10);
    const passwordEncriptado = bcrypt.hashSync(req.body.password, saltos);
    req.body.password = passwordEncriptado;
    const usuarioNuevo = new Usuario(req.body);
    await usuarioNuevo.save();
    res.status(201).json({ mensaje: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error, no se pudo crear el usuario" });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({
      email: { $ne: process.env.ADMIN_EMAIL },
    });

    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error, no se pudo listar los usuarios" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //verificar el email
    const usuarioBuscado = await Usuario.findOne({ email });

    if (!usuarioBuscado) {
      return res.status(404).json({ mensaje: "El usuario no existe" });
    }

    if (usuarioBuscado.estado === "Suspendido") {
      return res.status(403).json({
        mensaje: "Tu cuenta ha sido suspendida. Contacta al administrador",
      });
    }

    //chequear el password
    const passwordValido = bcrypt.compareSync(
      password,
      usuarioBuscado.password
    );

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    //generar el token
    const token = generarJWT(
      usuarioBuscado.nombre,
      usuarioBuscado.email,
      usuarioBuscado.rol
    );
    res.status(200).json({
      mensaje: "Usuario logueado correctamente",
      nombre: usuarioBuscado.nombre,
      email: usuarioBuscado.email,
      _id: usuarioBuscado._id,
      rol: usuarioBuscado.rol,
      token,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al intentar loguear un usuario" });
  }
};

export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.estado = req.body.estado || usuario.estado;
    await usuario.save();

    res
      .status(200)
      .json({ mensaje: "Estado del usuario actualizado correctamente" });
  } catch (err) {
    res.status(500).json({
      mensaje: "Ocurrio un error al actualizar el estado del usuario",
    });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al actualizar el usuario" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.status(200).json({ mensaje: "Usuario eliminado exitosamente" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ mensaje: "Ocurrio un error al eliminar el usuario" });
  }
};

export const obtenerUsuarioID = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "El usuario no existe" });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Ocurrio un error al obtener el usuario" });
  }
};
