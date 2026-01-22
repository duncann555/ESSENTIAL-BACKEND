# Backend Viciar 🎮

Backend del proyecto **Viciar**. Esta es una **API** construida con **Node.js y Express** para la gestión de **productos de videojuegos, usuarios y pedidos**, con autenticación y control de roles.

El backend está diseñado para ser consumido por un frontend en **React**.

---

## ✨ Características

### 🕹️ Gestión de Productos

* Crear, leer, actualizar y eliminar productos (CRUD).
* Gestión de stock de videojuegos, consolas y accesorios.
* Validación de datos en creación y edición.
* Búsqueda de productos por ID.
* Carga y gestión de imágenes mediante **Multer + Cloudinary**.

### 📂 Categorías de Productos

* Juegos de PC
* PlayStation
* Xbox
* Nintendo
* Consolas
* Accesorios

### 👤 Gestión de Usuarios

* Registro de usuarios con contraseña encriptada.
* Login de usuarios.
* Autenticación mediante **JWT**.
* Manejo de roles:

  * `administrador`
  * `usuario`

### 🧾 Gestión de Pedidos

* Creación de pedidos asociados a usuarios.
* Manejo de **detalle de pedidos** con productos y cantidades.
* Cálculo del total del pedido.

### 🔐 Seguridad

* Rutas protegidas con token JWT válido.
* Control de acceso según rol.
* Encriptación de contraseñas usando **bcrypt**.

---

## 🚀 Tecnologías Utilizadas

### Backend

* **Node.js** – Entorno de ejecución JavaScript.
* **Express.js** – Framework para construir la API REST.
* **MongoDB Atlas** – Base de datos NoSQL en la nube.
* **Mongoose** – ODM para modelado de datos.

### Autenticación y Validación

* **JSON Web Token (JWT)** – Autenticación segura.
* **bcrypt** – Hasheo de contraseñas.
* **express-validator** – Validación de datos de entrada.

### Utilidades

* **morgan** – Logger de peticiones HTTP.
* **cors** – Habilitación de Cross-Origin Resource Sharing.
* **multer** – Manejo de subida de archivos.
* **cloudinary** – Almacenamiento de imágenes en la nube.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

* Node.js (versión 18.x o superior recomendada)
* npm
* Cuenta en **MongoDB Atlas**
* Cuenta en **Cloudinary**

---

## ⚙️ Instalación y Configuración

Clona el repositorio:

```bash
git clone https://github.com/duncann555/viciar-backend.git
cd viciar-backend
```

Instala las dependencias:

```bash
npm install
```

Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000

# MongoDB Atlas
MONGODB=mongodb+srv://paulagramajo:paula2212@cluster0.qltftnx.mongodb.net/viciAR

# JWT
SECRETJWT=PaUAbUeLa3113$


#Datos Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=AdminAlfa777
```

---

## 📜 Scripts Disponibles

En el `package.json` encontrarás:

Para iniciar el servidor en producción:

Para iniciar el servidor en desarrollo (modo watch):

```bash
npm run dev
```

---

## 🕹️ Endpoints de la API

La API expone endpoints para:

* Autenticación (login / registro)
* Usuarios
* Productos
* Pedidos y detalle de pedidos

📘 *La documentación completa de endpoints puede encontrarse en el proyecto.*

---

🌐 Deploy

El backend se encuentra deployado en Vercel y disponible en el siguiente enlace:

🔗 https://viciar-backend.vercel.app

---

## ✒️ Autores

* Héctor Eduardo Velásquez
* Luis Geremias Robles
* Maximiliano Gómez Tolrá
* Paula Gramajo
* Sebastian Flomenbaun


🎮 *Viciar no es un vicio, es una pasión.*
