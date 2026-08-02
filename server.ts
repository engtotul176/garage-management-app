import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiV1Router } from "./src/server/apiRouter";
import { ApiBackendService } from "./src/services/apiBackendService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      system: "Ababil Enterprise Cloud SaaS REST API Engine",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  });

  // Swagger OpenAPI 3.0 spec endpoint
  app.get("/api/v1/docs/openapi.json", (req, res) => {
    res.json(ApiBackendService.generateOpenApiSpec());
  });

  // Postman Collection v2.1 spec endpoint
  app.get("/api/v1/docs/postman.json", (req, res) => {
    res.json(ApiBackendService.generatePostmanCollection());
  });

  // REST API v1 Module Router
  app.use("/api/v1", apiV1Router);

  // Vite middleware for development or Static Server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ABABIL REST API SERVER] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
