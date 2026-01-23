import jwt from "jsonwebtoken";

const generarJWT = (usuario) => {
  const payload = {
    uid: usuario._id,
    email: usuario.email,
    rol: usuario.rol,
  };

  return jwt.sign(payload, process.env.SECRETJWT, {
    expiresIn: "2h",
  });
};

export default generarJWT;
