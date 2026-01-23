import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";
import generarJWT from "../middlewares/generarJWT.js";

/* ======================================================
   1. CREAR USUARIO (Registro)
====================================================== */
export const crearUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si ya existe
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    usuario = new Usuario(req.body);

    // Encriptar password
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    res.status(201).json({ mensaje: "Usuario creado correctamente", nombre: usuario.nombre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el usuario" });
  }
};

/* ======================================================
   2. LOGIN (Blindado)
====================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si existe el email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // Verificar estado
    if (usuario.estado !== "Activo") {
      return res.status(401).json({ mensaje: "Cuenta suspendida o pendiente" });
    }

    // Verificar password
    const passwordValido = bcrypt.compareSync(password, usuario.password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    // Generar Token (Con los 4 datos clave)
    const token = await generarJWT(usuario._id, usuario.nombre, usuario.rol, usuario.email);

    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        uid: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en el login" });
  }
};

/* ======================================================
   3. LISTAR USUARIOS (Menos el Admin principal)
====================================================== */
export const listarUsuarios = async (req, res) => {
  try {
    // Opcional: Filtrar para no mostrar al Super Admin si lo tenés en .env
    const usuarios = await Usuario.find({ email: { $ne: process.env.ADMIN_EMAIL } });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al listar usuarios" });
  }
};

/* ======================================================
   4. OBTENER USUARIO POR ID
====================================================== */
export const obtenerUsuarioID = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al buscar usuario" });
  }
};

/* ======================================================
   5. ACTUALIZAR USUARIO (Datos generales)
====================================================== */
export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    // Sacamos password y email del body para tratarlos aparte si vienen
    const { password, email, ...restoDatos } = req.body;

    // Validación extra si cambia el email
    if (email) {
      const existe = await Usuario.findOne({ email });
      if (existe && existe._id.toString() !== id) {
        return res.status(400).json({ mensaje: "Ese email ya está en uso" });
      }
      restoDatos.email = email;
    }

    // Si cambia password, re-encriptar
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      restoDatos.password = bcrypt.hashSync(password, salt);
    }

    const usuarioEditado = await Usuario.findByIdAndUpdate(id, restoDatos, { new: true });
    
    if(!usuarioEditado) return res.status(404).json({mensaje: "Usuario no encontrado"});

    res.status(200).json({ mensaje: "Usuario actualizado", usuario: usuarioEditado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

/* ======================================================
   6. CAMBIAR ESTADO (Suspendido/Activo)
      ¡Esta es la que te faltaba!
====================================================== */
export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { estado } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id, 
      { estado }, 
      { new: true }
    );

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.status(200).json({ mensaje: "Estado actualizado", usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cambiar estado" });
  }
};

/* ======================================================
   7. ELIMINAR USUARIO
====================================================== */
export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    
    res.status(200).json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};