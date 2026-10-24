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
import { DatabaseAdapter } from "./databaseTypes.ts";

export class MemoryDatabaseAdapter implements DatabaseAdapter {
  private users = new Map<string, User>();
  private workspaces = new Map<string, Workspace>();
  private workspaceMembers = new Map<string, WorkspaceMember>();
  private events = new Map<string, Event>();
  private plans = new Map<string, Plan>();
  private tasks = new Map<string, Task>();
  private budgetItems = new Map<string, BudgetItem>();
  private vendors = new Map<string, Vendor>();
  private ideas = new Map<string, Idea>();
  private risks = new Map<string, Risk>();
  private runOfShow = new Map<string, RunOfShowItem>();
  private shares = new Map<string, Share>();
  private subscriptions = new Map<string, Subscription>();
  private usage = new Array<UsageLedger>();
  private activities = new Array<ActivityLog>();

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  async createUser(user: User): Promise<User> {
    this.users.set(user.id, { ...user });
    return user;
  }

  async getWorkspace(id: string): Promise<Workspace | null> {
    return this.workspaces.get(id) || null;
  }

  async listWorkspacesForUser(userId: string): Promise<Workspace[]> {
    const wsIds = new Set<string>();
    for (const m of this.workspaceMembers.values()) {
      if (m.userId === userId) wsIds.add(m.workspaceId);
    }
    const result: Workspace[] = [];
    for (const id of wsIds) {
      const w = this.workspaces.get(id);
      if (w) result.push({ ...w });
    }
    return result;
  }

  async createWorkspace(workspace: Workspace): Promise<Workspace> {
    this.workspaces.set(workspace.id, { ...workspace });
    return workspace;
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | null> {
    const existing = this.workspaces.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.workspaces.set(id, updated);
    return updated;
  }

  async getWorkspaceMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
    for (const m of this.workspaceMembers.values()) {
      if (m.workspaceId === workspaceId && m.userId === userId) {
        return { ...m };
      }
    }
    return null;
  }

  async listWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const members: WorkspaceMember[] = [];
    for (const m of this.workspaceMembers.values()) {
      if (m.workspaceId === workspaceId) {
        const user = this.users.get(m.userId);
        members.push({ ...m, user: user ? { ...user } : undefined });
      }
    }
    return members;
  }

  async addWorkspaceMember(member: WorkspaceMember): Promise<WorkspaceMember> {
    this.workspaceMembers.set(member.id, { ...member });
    return member;
  }

  async getEvent(id: string): Promise<Event | null> {
    return this.events.get(id) || null;
  }

  async listEvents(workspaceId: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter((e) => e.workspaceId === workspaceId);
  }

  async createEvent(event: Event): Promise<Event> {
    this.events.set(event.id, { ...event });
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    const existing = this.events.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async getLatestPlan(eventId: string): Promise<Plan | null> {
    const plans = await this.listPlans(eventId);
    if (plans.length === 0) return null;
    return plans.sort((a, b) => b.version - a.version)[0];
  }

  async listPlans(eventId: string): Promise<Plan[]> {
    return Array.from(this.plans.values()).filter((p) => p.eventId === eventId);
  }

  async createPlan(plan: Plan): Promise<Plan> {
    this.plans.set(plan.id, { ...plan });
    return plan;
  }

  async updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | null> {
    const existing = this.plans.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.plans.set(id, updated);
    return updated;
  }

  async listTasks(eventId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.eventId === eventId);
  }

  async createTask(task: Task): Promise<Task> {
    this.tasks.set(task.id, { ...task });
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const existing = this.tasks.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async listBudgetItems(eventId: string): Promise<BudgetItem[]> {
    return Array.from(this.budgetItems.values()).filter((b) => b.eventId === eventId);
  }

  async createBudgetItem(item: BudgetItem): Promise<BudgetItem> {
    this.budgetItems.set(item.id, { ...item });
    return item;
  }

  async updateBudgetItem(id: string, updates: Partial<BudgetItem>): Promise<BudgetItem | null> {
    const existing = this.budgetItems.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.budgetItems.set(id, updated);
    return updated;
  }

  async deleteBudgetItem(id: string): Promise<boolean> {
    return this.budgetItems.delete(id);
  }

  async listVendors(eventId: string): Promise<Vendor[]> {
    return Array.from(this.vendors.values()).filter((v) => v.eventId === eventId);
  }

  async createVendor(vendor: Vendor): Promise<Vendor> {
    this.vendors.set(vendor.id, { ...vendor });
    return vendor;
  }

  async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
    const existing = this.vendors.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: string): Promise<boolean> {
    return this.vendors.delete(id);
  }

  async listIdeas(eventId: string): Promise<Idea[]> {
    return Array.from(this.ideas.values()).filter((i) => i.eventId === eventId);
  }

  async createIdea(idea: Idea): Promise<Idea> {
    this.ideas.set(idea.id, { ...idea });
    return idea;
  }

  async updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | null> {
    const existing = this.ideas.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.ideas.set(id, updated);
    return updated;
  }

  async deleteIdea(id: string): Promise<boolean> {
    return this.ideas.delete(id);
  }

  async listRisks(eventId: string): Promise<Risk[]> {
    return Array.from(this.risks.values()).filter((r) => r.eventId === eventId);
  }

  async createRisk(risk: Risk): Promise<Risk> {
    this.risks.set(risk.id, { ...risk });
    return risk;
  }

  async updateRisk(id: string, updates: Partial<Risk>): Promise<Risk | null> {
    const existing = this.risks.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.risks.set(id, updated);
    return updated;
  }

  async deleteRisk(id: string): Promise<boolean> {
    return this.risks.delete(id);
  }

  async listRunOfShow(eventId: string): Promise<RunOfShowItem[]> {
    return Array.from(this.runOfShow.values())
      .filter((r) => r.eventId === eventId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createRunOfShow(item: RunOfShowItem): Promise<RunOfShowItem> {
    this.runOfShow.set(item.id, { ...item });
    return item;
  }

  async updateRunOfShow(id: string, updates: Partial<RunOfShowItem>): Promise<RunOfShowItem | null> {
    const existing = this.runOfShow.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.runOfShow.set(id, updated);
    return updated;
  }

  async deleteRunOfShow(id: string): Promise<boolean> {
    return this.runOfShow.delete(id);
  }

  async getShareByToken(token: string): Promise<Share | null> {
    for (const s of this.shares.values()) {
      if (s.shareToken === token && !s.isRevoked) {
        if (s.expiresAt && new Date(s.expiresAt) < new Date()) {
          return null;
        }
        return { ...s };
      }
    }
    return null;
  }

  async getShareForEvent(eventId: string): Promise<Share | null> {
    for (const s of this.shares.values()) {
      if (s.eventId === eventId && !s.isRevoked) {
        return { ...s };
      }
    }
    return null;
  }

  async createShare(share: Share): Promise<Share> {
    this.shares.set(share.id, { ...share });
    return share;
  }

  async revokeShare(id: string): Promise<boolean> {
    const existing = this.shares.get(id);
    if (!existing) return false;
    existing.isRevoked = true;
    return true;
  }

  async incrementShareViews(token: string): Promise<void> {
    for (const s of this.shares.values()) {
      if (s.shareToken === token) {
        s.viewCount += 1;
        break;
      }
    }
  }

  async getSubscription(workspaceId: string): Promise<Subscription | null> {
    return this.subscriptions.get(workspaceId) || null;
  }

  async saveSubscription(sub: Subscription): Promise<Subscription> {
    this.subscriptions.set(sub.workspaceId, { ...sub });
    return sub;
  }

  async recordUsage(usage: UsageLedger): Promise<void> {
    this.usage.push({ ...usage });
  }

  async getUsageSummary(workspaceId: string): Promise<{ totalGenerations: number; activeEvents: number }> {
    const activeEvents = Array.from(this.events.values()).filter(
      (e) => e.workspaceId === workspaceId && e.status !== "archived" && e.status !== "completed"
    ).length;
    const totalGenerations = this.usage.filter((u) => u.workspaceId === workspaceId && u.feature === "plan_generate").length;
    return { totalGenerations, activeEvents };
  }

  async logActivity(log: ActivityLog): Promise<void> {
    this.activities.unshift({ ...log });
  }

  async listActivity(workspaceId: string, eventId?: string): Promise<ActivityLog[]> {
    return this.activities.filter((a) => {
      if (a.workspaceId !== workspaceId) return false;
      if (eventId && a.eventId !== eventId) return false;
      return true;
    });
  }

  async reset(): Promise<void> {
    this.users.clear();
    this.workspaces.clear();
    this.workspaceMembers.clear();
    this.events.clear();
    this.plans.clear();
    this.tasks.clear();
    this.budgetItems.clear();
    this.vendors.clear();
    this.ideas.clear();
    this.risks.clear();
    this.runOfShow.clear();
    this.shares.clear();
    this.subscriptions.clear();
    this.usage.length = 0;
    this.activities.length = 0;
  }
}
