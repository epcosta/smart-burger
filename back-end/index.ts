import express from "express";
import { connection } from "./src/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./src/router.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/swagger.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.get("/teste-swagger", (req, res) => {
  res.send("Swagger teste funcionando!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));
app.use(router);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  console.log("Swagger em http://localhost:3000/api-docs");
  connection();
});
