/**
 * Festiya Cloudflare Worker Entrypoint
 */

import { app } from "./routes/api.ts";

export default {
  fetch(request: Request, env: Record<string, unknown>, ctx: any) {
    return app.fetch(request, env, ctx);
  },
};
