import cloudinary from "./cloudinary.js";

const cloudinaryUploader = (file) => {
  return new Promise((resolve, reject) => {
    // Si no llega archivo, devolvemos null
    if (!file) {
        resolve(null);
        return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "essenzia_productos", // Nombre de la carpeta en Cloudinary
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Error interno de Cloudinary:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // ACA ESTÁ LA CLAVE: El helper extrae el buffer del archivo
    uploadStream.end(file.buffer);
  });
};

export default cloudinaryUploader;