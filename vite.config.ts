import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "http";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "festiya-api-middleware",
      configureServer(server) {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (!req.url?.startsWith("/api")) {
            return next();
          }

          try {
            const { app } = await server.ssrLoadModule("/src/server/routes/api.ts");
            const protocol = req.headers["x-forwarded-proto"] || "http";
            const host = req.headers.host || "localhost:5173";
            const fullUrl = `${protocol}://${host}${req.url}`;

            // Read request body if present
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
            const bodyBuffer = Buffer.concat(chunks);
            const body = ["GET", "HEAD"].includes(req.method || "") ? undefined : bodyBuffer;

            // Build standard Request
            const headers = new Headers();
            for (const [key, value] of Object.entries(req.headers)) {
              if (value) {
                if (Array.isArray(value)) {
                  value.forEach((v) => headers.append(key, v));
                } else {
                  headers.set(key, value);
                }
              }
            }

            const webReq = new Request(fullUrl, {
              method: req.method,
              headers,
              body,
            });

            const webRes: Response = await app.fetch(webReq);

            res.statusCode = webRes.status;
            webRes.headers.forEach((val, key) => {
              res.setHeader(key, val);
            });

            const resArrayBuffer = await webRes.arrayBuffer();
            res.end(Buffer.from(resArrayBuffer));
          } catch (err) {
            console.error("[API Middleware Error]:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Internal Server Error in API middleware" }));
          }
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
});
