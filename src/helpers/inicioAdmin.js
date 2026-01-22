import Usuario from "../models/usuario.js";
import bcrypt from "bcrypt";

export const inicioAdmin = async (req, res) => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    //preguntamos si ya existe un usuario con ese email
    const adminExiste = await Usuario.findOne({ email: ADMIN_EMAIL });

    if (adminExiste) {
      console.log("El administrador ya existe, no es necesario crearlo");
      return; //si existe, se corta aqui la funcion
    }

    //si no existe, preparamos el objeto
    //se encripta la contraseña
    const saltos = bcrypt.genSaltSync(10);
    const passwordEncriptado = bcrypt.hashSync(ADMIN_PASSWORD, saltos);

    const nuevoAdmin = new Usuario({
      nombre: "juan",
      apellido: "perez",
      dni: 12345678,
      telefono: 123456789,
      email: ADMIN_EMAIL,
      password: passwordEncriptado, //guardamos la contraseña encriptada
      rol: "Administrador",
      estado: "Activo",
    });

    //guardamos en la base de datos
    await nuevoAdmin.save();

    console.log("Usuario Administrador creado exitosamente.");
  } catch (error) {
    console.error("Error al inicializar admin: ", error);
  }
};
