import jwt from "jsonwebtoken";

const generarJWT = (uid, nombre, rol, email) => {
  return new Promise((resolve, reject) => {
    
    const payload = { uid, nombre, rol, email };

    // AQUI ESTABA EL ERROR: Usamos SECRETJWT (sin guion) para que coincida con tu .env
    jwt.sign(
      payload,
      process.env.SECRETJWT, 
      {
        expiresIn: "4h",
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