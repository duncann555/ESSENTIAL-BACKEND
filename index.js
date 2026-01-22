import indexRoutes from "./src/routes/index.routes.js";
import Server from "./src/server/config.js";

const server = new Server();

server.app.use("/api", indexRoutes);

server.listen();
