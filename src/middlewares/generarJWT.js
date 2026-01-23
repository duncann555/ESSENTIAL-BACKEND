import jwt from "jsonwebtoken";

const generarJWT = (uid, nombre, rol, email) => {
  return new Promise((resolve, reject) => {
    
    // Guardamos los datos importantes en el token
    const payload = { uid, nombre, rol, email };

    // Usamos process.env.SECRETJWT (Coincide con tu .env)
    jwt.sign(
      payload,
      process.env.SECRETJWT, 
      {
        expiresIn: "4h", // El token dura 4 horas
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }
        resolve(token);
      }
    );
  });
};

export default generarJWT;