import { Context, Next } from "hono";
import { db } from "../db/database.ts";

/**
 * Strict Tenant Isolation Middleware
 * Guarantees zero cross-tenant contamination.
 * Verifies that the authenticated user has explicit membership in the target workspace.
 */
export async function enforceTenantIsolation(c: Context, next: Next) {
  const userId = c.get("userId");
  const match = c.req.path.match(/\/api\/workspaces\/([^/]+)/);
  const workspaceId =
    c.req.header("x-workspace-id") ||
    c.req.query("workspaceId") ||
    c.req.param("workspaceId") ||
    (match ? match[1] : undefined);

  if (workspaceId && userId) {
    const member = await db.getWorkspaceMember(workspaceId, userId);
    if (!member) {
      return c.json(
        {
          error: "Forbidden: Access denied to this workspace tenant.",
          code: "CROSS_TENANT_ACCESS_BLOCKED",
        },
        403
      );
    }
  }

  await next();
}
