import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import "./dbconfig.js";
import router from "../routes/index.routes.js";

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(morgan("dev"));

    const __dirname = dirname(fileURLToPath(import.meta.url));
    this.app.use(express.static(__dirname + "/../../public/"));
  }

    routes() {
    // 🔥 ACÁ SE CONECTAN TUS ROUTES
    this.app.use("/api", router);
  }

  listen() {
    this.app.listen(this.port, () =>
      console.info(
        `El servidor se esta ejecutando en: http://localhost:${this.port}`,
      ),
    );
  }
}
