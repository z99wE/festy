import { Hono } from "hono";
import { db } from "../db/database.ts";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../services/auth.ts";
import { User, Workspace, WorkspaceMember } from "../../types/index.ts";

export const authRouter = new Hono();

// 1. Sign Up Endpoint
authRouter.post("/api/auth/signup", async (c) => {
  try {
    const { email, password, name, workspaceName } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({ error: "Name, email, and password are required" }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: "Password must be at least 8 characters long" }, 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await db.getUserByEmail(normalizedEmail);
    if (existing) {
      return c.json({ error: "An account with this email already exists" }, 409);
    }

    const { hash, salt } = await hashPassword(password);
    const userId = `usr_${Math.random().toString(36).substring(2, 10)}`;

    const newUser: User = {
      id: userId,
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: hash,
      passwordSalt: salt,
      locale: "en-US",
      timezone: "UTC",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.createUser(newUser);

    // Create an isolated personal workspace for the new tenant
    const wsId = `ws_${Math.random().toString(36).substring(2, 10)}`;
    const newWorkspace: Workspace = {
      id: wsId,
      name: workspaceName?.trim() || `${name.trim()}'s Workspace`,
      type: "personal",
      ownerId: userId,
      subscriptionTier: "free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.createWorkspace(newWorkspace);

    // Add workspace owner membership
    const member: WorkspaceMember = {
      id: `wsm_${Math.random().toString(36).substring(2, 10)}`,
      workspaceId: wsId,
      userId,
      role: "owner",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await db.addWorkspaceMember(member);

    // Issue JWT session token
    const token = await createSessionToken({ userId, email: normalizedEmail });

    return c.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      workspace: newWorkspace,
    }, 201);
  } catch (err) {
    console.error("Sign up error:", err);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// 2. Sign In / Login Endpoint
authRouter.post("/api/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.getUserByEmail(normalizedEmail);
    if (!user || !user.passwordHash || !user.passwordSalt) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const workspaces = await db.listWorkspacesForUser(user.id);
    const token = await createSessionToken({ userId: user.id, email: user.email });

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      workspaces,
    });
  } catch (err) {
    console.error("Login error:", err);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

// 3. Current User Session Endpoint
authRouter.get("/api/auth/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!token) {
    // Return demo default if unauthenticated
    const defaultUser = await db.getUser("usr_souvik");
    const workspaces = defaultUser ? await db.listWorkspacesForUser(defaultUser.id) : [];
    return c.json({ user: defaultUser, workspaces, isAuthenticated: false });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return c.json({ error: "Session expired or invalid" }, 401);
  }

  const user = await db.getUser(payload.userId);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const workspaces = await db.listWorkspacesForUser(user.id);
  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    workspaces,
    isAuthenticated: true,
  });
});

// 4. Logout Endpoint
authRouter.post("/api/auth/logout", (c) => {
  return c.json({ success: true, message: "Logged out successfully" });
});
