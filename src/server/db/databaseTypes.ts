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

export interface DatabaseAdapter {
  // Users
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;

  // Workspaces
  getWorkspace(id: string): Promise<Workspace | null>;
  listWorkspacesForUser(userId: string): Promise<Workspace[]>;
  createWorkspace(workspace: Workspace): Promise<Workspace>;
  updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | null>;

  // Workspace Members
  getWorkspaceMember(workspaceId: string, userId: string): Promise<WorkspaceMember | null>;
  listWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  addWorkspaceMember(member: WorkspaceMember): Promise<WorkspaceMember>;

  // Events
  getEvent(id: string): Promise<Event | null>;
  listEvents(workspaceId: string): Promise<Event[]>;
  createEvent(event: Event): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | null>;
  deleteEvent(id: string): Promise<boolean>;

  // Plans
  getLatestPlan(eventId: string): Promise<Plan | null>;
  listPlans(eventId: string): Promise<Plan[]>;
  createPlan(plan: Plan): Promise<Plan>;
  updatePlan(id: string, updates: Partial<Plan>): Promise<Plan | null>;

  // Tasks
  listTasks(eventId: string): Promise<Task[]>;
  createTask(task: Task): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | null>;
  deleteTask(id: string): Promise<boolean>;

  // Budget Items
  listBudgetItems(eventId: string): Promise<BudgetItem[]>;
  createBudgetItem(item: BudgetItem): Promise<BudgetItem>;
  updateBudgetItem(id: string, updates: Partial<BudgetItem>): Promise<BudgetItem | null>;
  deleteBudgetItem(id: string): Promise<boolean>;

  // Vendors
  listVendors(eventId: string): Promise<Vendor[]>;
  createVendor(vendor: Vendor): Promise<Vendor>;
  updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor | null>;
  deleteVendor(id: string): Promise<boolean>;

  // Ideas
  listIdeas(eventId: string): Promise<Idea[]>;
  createIdea(idea: Idea): Promise<Idea>;
  updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | null>;
  deleteIdea(id: string): Promise<boolean>;

  // Risks
  listRisks(eventId: string): Promise<Risk[]>;
  createRisk(risk: Risk): Promise<Risk>;
  updateRisk(id: string, updates: Partial<Risk>): Promise<Risk | null>;
  deleteRisk(id: string): Promise<boolean>;

  // Run of Show
  listRunOfShow(eventId: string): Promise<RunOfShowItem[]>;
  createRunOfShow(item: RunOfShowItem): Promise<RunOfShowItem>;
  updateRunOfShow(id: string, updates: Partial<RunOfShowItem>): Promise<RunOfShowItem | null>;
  deleteRunOfShow(id: string): Promise<boolean>;

  // Shares
  getShareByToken(token: string): Promise<Share | null>;
  getShareForEvent(eventId: string): Promise<Share | null>;
  createShare(share: Share): Promise<Share>;
  revokeShare(id: string): Promise<boolean>;
  incrementShareViews(token: string): Promise<void>;

  // Subscriptions & Usage
  getSubscription(workspaceId: string): Promise<Subscription | null>;
  saveSubscription(sub: Subscription): Promise<Subscription>;
  recordUsage(usage: UsageLedger): Promise<void>;
  getUsageSummary(workspaceId: string): Promise<{ totalGenerations: number; activeEvents: number }>;

  // Activity Log
  logActivity(log: ActivityLog): Promise<void>;
  listActivity(workspaceId: string, eventId?: string): Promise<ActivityLog[]>;

  // Raw reset (for tests)
  reset(): Promise<void>;
}
