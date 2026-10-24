import { DatabaseAdapter } from "./databaseTypes.ts";
import {
  User,
  Workspace,
  WorkspaceMember,
  Event,
  Plan,
  Task,
  BudgetItem,
  Vendor,
  Idea,
  Risk,
  RunOfShowItem,
  Share,
  Subscription,
  UsageLedger,
  ActivityLog,
} from "../../types/index.ts";

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<any[]>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[]; success: boolean; error?: string }>;
  run(): Promise<{ success: boolean; meta: any }>;
}

export class D1DatabaseAdapter implements DatabaseAdapter {
  constructor(private d1: D1Database) {}

  // 1. Users
  async getUser(id: string): Promise<User | null> {
    const row = await this.d1.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    return this.mapUser(row);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const row = await this.d1
      .prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)")
      .bind(email.trim())
      .first<any>();
    if (!row) return null;
    return this.mapUser(row);
  }

  async createUser(user: User): Promise<User> {
    await this.d1
      .prepare(
        `INSERT INTO users (id, email, name, password_hash, password_salt, avatar_url, locale, timezone, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        user.id,
        user.email.toLowerCase(),
        user.name,
        user.passwordHash || null,
        user.passwordSalt || null,
        user.avatarUrl || null,
        user.locale || "en-US",
        user.timezone || "UTC",
        user.createdAt,
        user.updatedAt
      )
      .run();
    return user;
  }

  private mapUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash || undefined,
      passwordSalt: row.password_salt || undefined,
      avatarUrl: row.avatar_url || undefined,
      locale: row.locale,
      timezone: row.timezone,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 2. Workspaces
  async getWorkspace(id: string): Promise<Workspace | null> {
    const row = await this.d1.prepare("SELECT * FROM workspaces WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    return this.mapWorkspace(row);
  }

  async listWorkspacesForUser(userId: string): Promise<Workspace[]> {
    const res = await this.d1
      .prepare(
        `SELECT w.* FROM workspaces w
         JOIN workspace_members wm ON w.id = wm.workspace_id
         WHERE wm.user_id = ?
         ORDER BY w.created_at ASC`
      )
      .bind(userId)
      .all<any>();
    return (res.results || []).map((r) => this.mapWorkspace(r));
  }

  async createWorkspace(ws: Workspace): Promise<Workspace> {
    await this.d1
      .prepare(
        `INSERT INTO workspaces (id, name, type, owner_id, brand_name, brand_logo, brand_color, subscription_tier, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        ws.id,
        ws.name,
        ws.type,
        ws.ownerId,
        ws.brandName || null,
        ws.brandLogo || null,
        ws.brandColor || null,
        ws.subscriptionTier,
        ws.createdAt,
        ws.updatedAt
      )
      .run();
    return ws;
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | null> {
    const current = await this.getWorkspace(id);
    if (!current) return null;
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await this.d1
      .prepare(
        `UPDATE workspaces SET name = ?, type = ?, brand_name = ?, brand_logo = ?, brand_color = ?, subscription_tier = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        updated.name,
        updated.type,
        updated.brandName || null,
        updated.brandLogo || null,
        updated.brandColor || null,
        updated.subscriptionTier,
        updated.updatedAt,
        id
      )
      .run();
    return updated;
  }

  private mapWorkspace(row: any): Workspace {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      ownerId: row.owner_id,
      brandName: row.brand_name || undefined,
      brandLogo: row.brand_logo || undefined,
      brandColor: row.brand_color || undefined,
      subscriptionTier: row.subscription_tier,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 3. Workspace Members
  async getWorkspaceMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
    const row = await this.d1
      .prepare("SELECT * FROM workspace_members WHERE workspace_id = ? AND user_id = ?")
      .bind(workspaceId, userId)
      .first<any>();
    if (!row) return null;
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      userId: row.user_id,
      role: row.role,
      status: row.status,
      createdAt: row.created_at,
    };
  }

  async listWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const res = await this.d1
      .prepare("SELECT * FROM workspace_members WHERE workspace_id = ?")
      .bind(workspaceId)
      .all<any>();
    return (res.results || []).map((row) => ({
      id: row.id,
      workspaceId: row.workspace_id,
      userId: row.user_id,
      role: row.role,
      status: row.status,
      createdAt: row.created_at,
    }));
  }

  async addWorkspaceMember(member: WorkspaceMember): Promise<WorkspaceMember> {
    await this.d1
      .prepare(
        `INSERT INTO workspace_members (id, workspace_id, user_id, role, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(member.id, member.workspaceId, member.userId, member.role, member.status, member.createdAt)
      .run();
    return member;
  }

  // 4. Events
  async getEvent(id: string): Promise<Event | null> {
    const row = await this.d1.prepare("SELECT * FROM events WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    return this.mapEvent(row);
  }

  async listEvents(workspaceId: string): Promise<Event[]> {
    const res = await this.d1
      .prepare("SELECT * FROM events WHERE workspace_id = ? ORDER BY created_at DESC")
      .bind(workspaceId)
      .all<any>();
    return (res.results || []).map((r) => this.mapEvent(r));
  }

  async createEvent(event: Event): Promise<Event> {
    await this.d1
      .prepare(
        `INSERT INTO events (id, workspace_id, name, occasion, category, date_mode, start_date, end_date, timezone, location_mode, location_address, guest_count, currency, target_budget, style, constraints, created_by, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        event.id,
        event.workspaceId,
        event.name,
        event.occasion,
        event.category,
        event.dateMode,
        event.startDate || null,
        event.endDate || null,
        event.timezone,
        event.locationMode,
        event.locationAddress || null,
        event.guestCount || null,
        event.currency,
        event.targetBudget || null,
        event.style || null,
        event.constraints || null,
        event.createdBy,
        event.status,
        event.createdAt,
        event.updatedAt
      )
      .run();
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const current = await this.getEvent(id);
    if (!current) return null;
    const u = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await this.d1
      .prepare(
        `UPDATE events SET name = ?, occasion = ?, category = ?, date_mode = ?, start_date = ?, end_date = ?, timezone = ?, location_mode = ?, location_address = ?, guest_count = ?, currency = ?, target_budget = ?, style = ?, constraints = ?, status = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        u.name,
        u.occasion,
        u.category,
        u.dateMode,
        u.startDate || null,
        u.endDate || null,
        u.timezone,
        u.locationMode,
        u.locationAddress || null,
        u.guestCount || null,
        u.currency,
        u.targetBudget || null,
        u.style || null,
        u.constraints || null,
        u.status,
        u.updatedAt,
        id
      )
      .run();
    return u;
  }

  async deleteEvent(id: string): Promise<boolean> {
    await this.d1.prepare("DELETE FROM events WHERE id = ?").bind(id).run();
    return true;
  }

  private mapEvent(row: any): Event {
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      name: row.name,
      occasion: row.occasion,
      category: row.category,
      dateMode: row.date_mode,
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
      timezone: row.timezone,
      locationMode: row.location_mode,
      locationAddress: row.location_address || undefined,
      guestCount: row.guest_count || undefined,
      currency: row.currency,
      targetBudget: row.target_budget || undefined,
      style: row.style || undefined,
      constraints: row.constraints || undefined,
      createdBy: row.created_by,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 5. Plans
  async getLatestPlan(eventId: string): Promise<Plan | null> {
    const plans = await this.listPlans(eventId);
    if (plans.length === 0) return null;
    return plans.sort((a, b) => b.version - a.version)[0];
  }

  async listPlans(eventId: string): Promise<Plan[]> {
    const res = await this.d1
      .prepare("SELECT * FROM plans WHERE event_id = ? ORDER BY version ASC")
      .bind(eventId)
      .all<any>();
    return (res.results || []).map((r) => this.mapPlan(r));
  }

  async createPlan(plan: Plan): Promise<Plan> {
    await this.d1
      .prepare(
        `INSERT INTO plans (id, event_id, version, schema_version, status, summary, assumptions_json, open_questions_json, content_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        plan.id,
        plan.eventId,
        plan.version,
        plan.schemaVersion,
        plan.status,
        plan.summary,
        JSON.stringify(plan.assumptions),
        JSON.stringify(plan.openQuestions),
        JSON.stringify(plan.content),
        plan.createdAt,
        plan.updatedAt
      )
      .run();
    return plan;
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | null> {
    const plans = await this.d1.prepare("SELECT * FROM plans WHERE id = ?").bind(id).first<any>();
    if (!plans) return null;
    const current = this.mapPlan(plans);
    const u: Plan = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await this.d1
      .prepare(
        `UPDATE plans SET version = ?, schema_version = ?, status = ?, summary = ?, assumptions_json = ?, open_questions_json = ?, content_json = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        u.version,
        u.schemaVersion,
        u.status,
        u.summary,
        JSON.stringify(u.assumptions),
        JSON.stringify(u.openQuestions),
        JSON.stringify(u.content),
        u.updatedAt,
        id
      )
      .run();
    return u;
  }

  private mapPlan(row: any): Plan {
    const rawAssumptions = row.assumptions_json ?? row.assumptions;
    const rawQuestions = row.open_questions_json ?? row.open_questions;
    const rawContent = row.content_json ?? row.content;

    return {
      id: row.id,
      eventId: row.event_id,
      version: row.version,
      schemaVersion: row.schema_version || "1",
      status: row.status || "active",
      summary: row.summary,
      assumptions: typeof rawAssumptions === "string" ? JSON.parse(rawAssumptions) : rawAssumptions || [],
      openQuestions: typeof rawQuestions === "string" ? JSON.parse(rawQuestions) : rawQuestions || [],
      content: typeof rawContent === "string" ? JSON.parse(rawContent) : rawContent,
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
    };
  }

  // 6. Tasks
  async listTasks(eventId: string): Promise<Task[]> {
    const res = await this.d1
      .prepare("SELECT * FROM tasks WHERE event_id = ? ORDER BY due_offset_days ASC, created_at ASC")
      .bind(eventId)
      .all<any>();
    return (res.results || []).map((r) => this.mapTask(r));
  }

  async createTask(task: Task): Promise<Task> {
    await this.d1
      .prepare(
        `INSERT INTO tasks (id, event_id, title, description, status, priority, owner_id, owner_name, due_date, due_offset_days, depends_on_json, linked_vendor_id, linked_budget_item_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        task.id,
        task.eventId,
        task.title,
        task.description || null,
        task.status,
        task.priority,
        task.ownerId || null,
        task.ownerName || null,
        task.dueDate || null,
        task.dueOffsetDays || null,
        JSON.stringify(task.dependsOn || []),
        task.linkedVendorId || null,
        task.linkedBudgetItemId || null,
        task.createdAt,
        task.updatedAt
      )
      .run();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const row = await this.d1.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    const current = this.mapTask(row);
    const u: Task = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await this.d1
      .prepare(
        `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, owner_id = ?, owner_name = ?, due_date = ?, due_offset_days = ?, depends_on_json = ?, linked_vendor_id = ?, linked_budget_item_id = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        u.title,
        u.description || null,
        u.status,
        u.priority,
        u.ownerId || null,
        u.ownerName || null,
        u.dueDate || null,
        u.dueOffsetDays || null,
        JSON.stringify(u.dependsOn || []),
        u.linkedVendorId || null,
        u.linkedBudgetItemId || null,
        u.updatedAt,
        id
      )
      .run();
    return u;
  }

  async deleteTask(id: string): Promise<boolean> {
    await this.d1.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
    return true;
  }

  private mapTask(r: any): Task {
    const rawDepends = r.depends_on_json ?? r.depends_on;
    return {
      id: r.id,
      eventId: r.event_id,
      title: r.title,
      description: r.description || undefined,
      status: r.status,
      priority: r.priority,
      ownerId: r.owner_id || undefined,
      ownerName: r.owner_name || undefined,
      dueDate: r.due_date || undefined,
      dueOffsetDays: r.due_offset_days !== null ? r.due_offset_days : undefined,
      dependsOn: typeof rawDepends === "string" ? JSON.parse(rawDepends) : rawDepends || [],
      linkedVendorId: r.linked_vendor_id || undefined,
      linkedBudgetItemId: r.linked_budget_item_id || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  // 7. Budget Items
  async listBudgetItems(eventId: string): Promise<BudgetItem[]> {
    const res = await this.d1
      .prepare("SELECT * FROM budget_items WHERE event_id = ? ORDER BY created_at ASC")
      .bind(eventId)
      .all<any>();
    return (res.results || []).map((r) => this.mapBudgetItem(r));
  }

  async createBudgetItem(item: BudgetItem): Promise<BudgetItem> {
    await this.d1
      .prepare(
        `INSERT INTO budget_items (id, event_id, category, label, low_estimate, likely_estimate, high_estimate, quoted_amount, committed_amount, actual_amount, currency, status, linked_vendor_id, rationale, is_estimate, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        item.id,
        item.eventId,
        item.category,
        item.label,
        item.lowEstimate ?? null,
        item.likelyEstimate ?? null,
        item.highEstimate ?? null,
        item.quotedAmount ?? null,
        item.committedAmount ?? null,
        item.actualAmount ?? null,
        item.currency,
        item.status,
        item.linkedVendorId || null,
        item.rationale || null,
        item.isEstimate ? 1 : 0,
        item.createdAt,
        item.updatedAt
      )
      .run();
    return item;
  }

  async updateBudgetItem(id: string, updates: Partial<BudgetItem>): Promise<BudgetItem | null> {
    const row = await this.d1.prepare("SELECT * FROM budget_items WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    const current = this.mapBudgetItem(row);
    const u: BudgetItem = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await this.d1
      .prepare(
        `UPDATE budget_items SET category = ?, label = ?, low_estimate = ?, likely_estimate = ?, high_estimate = ?, quoted_amount = ?, committed_amount = ?, actual_amount = ?, currency = ?, status = ?, linked_vendor_id = ?, rationale = ?, is_estimate = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        u.category,
        u.label,
        u.lowEstimate ?? null,
        u.likelyEstimate ?? null,
        u.highEstimate ?? null,
        u.quotedAmount ?? null,
        u.committedAmount ?? null,
        u.actualAmount ?? null,
        u.currency,
        u.status,
        u.linkedVendorId || null,
        u.rationale || null,
        u.isEstimate ? 1 : 0,
        u.updatedAt,
        id
      )
      .run();
    return u;
  }

  async deleteBudgetItem(id: string): Promise<boolean> {
    await this.d1.prepare("DELETE FROM budget_items WHERE id = ?").bind(id).run();
    return true;
  }

  private mapBudgetItem(r: any): BudgetItem {
    return {
      id: r.id,
      eventId: r.event_id,
      category: r.category,
      label: r.label,
      lowEstimate: r.low_estimate !== null ? r.low_estimate : undefined,
      likelyEstimate: r.likely_estimate !== null ? r.likely_estimate : undefined,
      highEstimate: r.high_estimate !== null ? r.high_estimate : undefined,
      quotedAmount: r.quoted_amount !== null ? r.quoted_amount : undefined,
      committedAmount: r.committed_amount !== null ? r.committed_amount : undefined,
      actualAmount: r.actual_amount !== null ? r.actual_amount : undefined,
      currency: r.currency,
      status: r.status,
      linkedVendorId: r.linked_vendor_id || undefined,
      rationale: r.rationale || undefined,
      isEstimate: Boolean(r.is_estimate),
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  // 8. Vendors
  async listVendors(eventId: string): Promise<Vendor[]> {
    const res = await this.d1
      .prepare("SELECT * FROM vendors WHERE event_id = ? ORDER BY created_at ASC")
      .bind(eventId)
      .all<any>();
    return (res.results || []).map((r) => this.mapVendor(r));
  }

  async createVendor(vendor: Vendor): Promise<Vendor> {
    await this.d1
      .prepare(
        `INSERT INTO vendors (id, event_id, name, category, contact_name, contact_email, contact_phone, website, notes, quote_amount, quote_currency, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        vendor.id,
        vendor.eventId,
        vendor.name,
        vendor.category,
        vendor.contactName || null,
        vendor.contactEmail || null,
        vendor.contactPhone || null,
        vendor.website || null,
        vendor.notes || null,
        vendor.quoteAmount ?? null,
        vendor.quoteCurrency || null,
        vendor.status,
        vendor.createdAt,
        vendor.updatedAt
      )
      .run();
    return vendor;
  }

  async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
    const row = await this.d1.prepare("SELECT * FROM vendors WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    const current = this.mapVendor(row);
    const u: Vendor = { ...current, ...updates, updatedAt: new Date().toISOString() };
    await this.d1
      .prepare(
        `UPDATE vendors SET name = ?, category = ?, contact_name = ?, contact_email = ?, contact_phone = ?, website = ?, notes = ?, quote_amount = ?, quote_currency = ?, status = ?, updated_at = ?
         WHERE id = ?`
      )
      .bind(
        u.name,
        u.category,
        u.contactName || null,
        u.contactEmail || null,
        u.contactPhone || null,
        u.website || null,
        u.notes || null,
        u.quoteAmount ?? null,
        u.quoteCurrency || null,
        u.status,
        u.updatedAt,
        id
      )
      .run();
    return u;
  }

  async deleteVendor(id: string): Promise<boolean> {
    await this.d1.prepare("DELETE FROM vendors WHERE id = ?").bind(id).run();
    return true;
  }

  private mapVendor(r: any): Vendor {
    return {
      id: r.id,
      eventId: r.event_id,
      name: r.name,
      category: r.category,
      contactName: r.contact_name || undefined,
      contactEmail: r.contact_email || undefined,
      contactPhone: r.contact_phone || undefined,
      website: r.website || undefined,
      notes: r.notes || undefined,
      quoteAmount: r.quote_amount !== null ? r.quote_amount : undefined,
      quoteCurrency: r.quote_currency || undefined,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    };
  }

  // 9. Ideas
  async listIdeas(eventId: string): Promise<Idea[]> {
    const res = await this.d1
      .prepare("SELECT * FROM ideas WHERE event_id = ? ORDER BY created_at ASC")
      .bind(eventId)
      .all<any>();
    return (res.results || []).map((r) => ({
      id: r.id,
      eventId: r.event_id,
      title: r.title,
      description: r.description,
      category: r.category,
      estimatedCostImpact: r.estimated_cost_impact,
      isAccepted: Boolean(r.is_accepted),
      createdAt: r.created_at,
    }));
  }

  async createIdea(idea: Idea): Promise<Idea> {
    await this.d1
      .prepare(
        `INSERT INTO ideas (id, event_id, title, description, category, estimated_cost_impact, is_accepted, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        idea.id,
        idea.eventId,
        idea.title,
        idea.description,
        idea.category,
        idea.estimatedCostImpact,
        idea.isAccepted ? 1 : 0,
        idea.createdAt
      )
      .run();
    return idea;
  }

  async updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | null> {
    const row = await this.d1.prepare("SELECT * FROM ideas WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    const isAccepted = updates.isAccepted !== undefined ? (updates.isAccepted ? 1 : 0) : row.is_accepted;
    await this.d1.prepare("UPDATE ideas SET is_accepted = ? WHERE id = ?").bind(isAccepted, id).run();
    return {
      id,
      eventId: row.event_id,
      title: row.title,
      description: row.description,
      category: row.category,
      estimatedCostImpact: row.estimated_cost_impact,
      isAccepted: Boolean(isAccepted),
      createdAt: row.created_at,
    };
  }

  async deleteIdea(id: string): Promise<boolean> {
    await this.d1.prepare("DELETE FROM ideas WHERE id = ?").bind(id).run();
    return true;
  }

  // 10. Risks
  async listRisks(eventId: string): Promise<Risk[]> {
    const res = await this.d1
      .prepare("SELECT * FROM risks WHERE event_id = ? ORDER BY created_at ASC")
      .bind(eventId)
      .all<any>();
    return (res.results || []).map((r) => ({
      id: r.id,
      eventId: r.event_id,
      risk: r.risk,
      mitigation: r.mitigation,
      severity: r.severity,
      isResolved: Boolean(r.is_resolved),
      createdAt: r.created_at,
    }));
  }

  async createRisk(risk: Risk): Promise<Risk> {
    await this.d1
      .prepare(
        `INSERT INTO risks (id, event_id, risk, mitigation, severity, is_resolved, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(risk.id, risk.eventId, risk.risk, risk.mitigation, risk.severity, risk.isResolved ? 1 : 0, risk.createdAt)
      .run();
    return risk;
  }

  async updateRisk(id: string, updates: Partial<Risk>): Promise<Risk | null> {
    const row = await this.d1.prepare("SELECT * FROM risks WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    const isResolved = updates.isResolved !== undefined ? (updates.isResolved ? 1 : 0) : row.is_resolved;
    await this.d1.prepare("UPDATE risks SET is_resolved = ? WHERE id = ?").bind(isResolved, id).run();
    return {
      id,
      eventId: row.event_id,
      risk: row.risk,
      mitigation: row.mitigation,
      severity: row.severity,
      isResolved: Boolean(isResolved),
      createdAt: row.created_at,
    };
  }

  async deleteRisk(id: string): Promise<boolean> {
    await this.d1.prepare("DELETE FROM risks WHERE id = ?").bind(id).run();
    return true;
  }

  // 11. Run of Show
  async listRunOfShow(eventId: string): Promise<RunOfShowItem[]> {
    const res = await this.d1
      .prepare("SELECT * FROM run_of_show WHERE event_id = ? ORDER BY sort_order ASC")
      .bind(eventId)
      .all<any>();
    return (res.results || []).map((r) => ({
      id: r.id,
      eventId: r.event_id,
      timeLabel: r.time_label,
      activity: r.activity,
      ownerName: r.owner_name || undefined,
      sortOrder: r.sort_order,
      createdAt: r.created_at,
    }));
  }

  async createRunOfShow(item: RunOfShowItem): Promise<RunOfShowItem> {
    await this.d1
      .prepare(
        `INSERT INTO run_of_show (id, event_id, time_label, activity, owner_name, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(item.id, item.eventId, item.timeLabel, item.activity, item.ownerName || null, item.sortOrder, item.createdAt)
      .run();
    return item;
  }

  async updateRunOfShow(id: string, updates: Partial<RunOfShowItem>): Promise<RunOfShowItem | null> {
    const row = await this.d1.prepare("SELECT * FROM run_of_show WHERE id = ?").bind(id).first<any>();
    if (!row) return null;
    const u = {
      timeLabel: updates.timeLabel ?? row.time_label,
      activity: updates.activity ?? row.activity,
      ownerName: updates.ownerName ?? row.owner_name,
      sortOrder: updates.sortOrder ?? row.sort_order,
    };
    await this.d1
      .prepare("UPDATE run_of_show SET time_label = ?, activity = ?, owner_name = ?, sort_order = ? WHERE id = ?")
      .bind(u.timeLabel, u.activity, u.ownerName || null, u.sortOrder, id)
      .run();
    return {
      id,
      eventId: row.event_id,
      timeLabel: u.timeLabel,
      activity: u.activity,
      ownerName: u.ownerName || undefined,
      sortOrder: u.sortOrder,
      createdAt: row.created_at,
    };
  }

  async deleteRunOfShow(id: string): Promise<boolean> {
    await this.d1.prepare("DELETE FROM run_of_show WHERE id = ?").bind(id).run();
    return true;
  }

  // 12. Shares
  async getShareByToken(token: string): Promise<Share | null> {
    const row = await this.d1
      .prepare("SELECT * FROM shares WHERE share_token = ? AND is_revoked = 0")
      .bind(token)
      .first<any>();
    if (!row) return null;
    return this.mapShare(row);
  }

  async getShareForEvent(eventId: string): Promise<Share | null> {
    const row = await this.d1
      .prepare("SELECT * FROM shares WHERE event_id = ? AND is_revoked = 0 ORDER BY created_at DESC LIMIT 1")
      .bind(eventId)
      .first<any>();
    if (!row) return null;
    return this.mapShare(row);
  }

  async createShare(share: Share): Promise<Share> {
    await this.d1
      .prepare(
        `INSERT INTO shares (id, event_id, share_token, role, allowed_sections_json, expires_at, is_revoked, view_count, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        share.id,
        share.eventId,
        share.shareToken,
        share.role,
        JSON.stringify(share.allowedSections),
        share.expiresAt || null,
        share.isRevoked ? 1 : 0,
        share.viewCount,
        share.createdAt
      )
      .run();
    return share;
  }

  async revokeShare(id: string): Promise<boolean> {
    await this.d1.prepare("UPDATE shares SET is_revoked = 1 WHERE id = ?").bind(id).run();
    return true;
  }

  async incrementShareViews(token: string): Promise<void> {
    await this.d1.prepare("UPDATE shares SET view_count = view_count + 1 WHERE share_token = ?").bind(token).run();
  }

  private mapShare(row: any): Share {
    const rawAllowed = row.allowed_sections_json ?? row.allowed_sections;
    return {
      id: row.id,
      eventId: row.event_id,
      shareToken: row.share_token,
      role: row.role,
      allowedSections: typeof rawAllowed === "string" ? JSON.parse(rawAllowed) : rawAllowed,
      expiresAt: row.expires_at || undefined,
      isRevoked: Boolean(row.is_revoked),
      viewCount: row.view_count,
      createdAt: row.created_at,
    };
  }

  // 13. Subscriptions & Usage
  async getSubscription(workspaceId: string): Promise<Subscription | null> {
    const row = await this.d1
      .prepare("SELECT * FROM subscriptions WHERE workspace_id = ?")
      .bind(workspaceId)
      .first<any>();
    if (!row) return null;
    return {
      id: row.id,
      workspaceId: row.workspace_id,
      tier: row.tier,
      status: row.status,
      currentPeriodEnd: row.current_period_end,
      paymentProvider: row.payment_provider,
      externalId: row.external_id || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async saveSubscription(sub: Subscription): Promise<Subscription> {
    await this.d1
      .prepare(
        `INSERT OR REPLACE INTO subscriptions (id, workspace_id, tier, status, current_period_end, payment_provider, external_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        sub.id,
        sub.workspaceId,
        sub.tier,
        sub.status,
        sub.currentPeriodEnd,
        sub.paymentProvider,
        sub.externalId || null,
        sub.createdAt,
        sub.updatedAt
      )
      .run();
    return sub;
  }

  async recordUsage(usage: UsageLedger): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO usage_ledger (id, workspace_id, feature, quantity, provider_model, estimated_cost, request_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        usage.id,
        usage.workspaceId,
        usage.feature,
        usage.quantity,
        usage.providerModel || null,
        usage.estimatedCost ?? null,
        usage.requestId,
        usage.createdAt
      )
      .run();
  }

  async getUsageSummary(workspaceId: string): Promise<{ totalGenerations: number; activeEvents: number }> {
    const genRow = await this.d1
      .prepare("SELECT COALESCE(SUM(quantity), 0) as total FROM usage_ledger WHERE workspace_id = ? AND feature = 'plan_generate'")
      .bind(workspaceId)
      .first<any>();

    const evtRow = await this.d1
      .prepare("SELECT COUNT(*) as count FROM events WHERE workspace_id = ? AND status != 'archived' AND status != 'completed'")
      .bind(workspaceId)
      .first<any>();

    return {
      totalGenerations: genRow?.total || 0,
      activeEvents: evtRow?.count || 0,
    };
  }

  // 14. Activity Log
  async logActivity(log: ActivityLog): Promise<void> {
    await this.d1
      .prepare(
        `INSERT INTO activity_log (id, workspace_id, event_id, actor_id, actor_name, action, entity_type, entity_id, metadata_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        log.id,
        log.workspaceId,
        log.eventId || null,
        log.actorId,
        log.actorName,
        log.action,
        log.entityType,
        log.entityId,
        JSON.stringify(log.metadata || {}),
        log.createdAt
      )
      .run();
  }

  async listActivity(workspaceId: string, eventId?: string): Promise<ActivityLog[]> {
    const query = eventId
      ? "SELECT * FROM activity_log WHERE workspace_id = ? AND event_id = ? ORDER BY created_at DESC LIMIT 50"
      : "SELECT * FROM activity_log WHERE workspace_id = ? ORDER BY created_at DESC LIMIT 50";
    const stmt = eventId
      ? this.d1.prepare(query).bind(workspaceId, eventId)
      : this.d1.prepare(query).bind(workspaceId);
    const res = await stmt.all<any>();
    return (res.results || []).map((r) => {
      const rawMeta = r.metadata_json ?? r.metadata;
      return {
        id: r.id,
        workspaceId: r.workspace_id,
        eventId: r.event_id || undefined,
        actorId: r.actor_id,
        actorName: r.actor_name,
        action: r.action,
        entityType: r.entity_type,
        entityId: r.entity_id,
        metadata: typeof rawMeta === "string" ? JSON.parse(rawMeta) : rawMeta,
        createdAt: r.created_at,
      };
    });
  }

  async reset(): Promise<void> {
    // In D1, tables persist, but clear if requested
    const tables = [
      "activity_log",
      "usage_ledger",
      "subscriptions",
      "shares",
      "run_of_show",
      "risks",
      "ideas",
      "vendors",
      "budget_items",
      "tasks",
      "plans",
      "events",
      "workspace_members",
      "workspaces",
      "users",
    ];
    for (const t of tables) {
      await this.d1.prepare(`DELETE FROM ${t}`).run();
    }
  }
}
