import { z } from "zod";

export type Role = "owner" | "admin" | "planner" | "client" | "viewer";
export type WorkspaceType = "personal" | "professional";
export type SubscriptionTier = "free" | "plus" | "pro" | "agency";
export type EventCategory = "wedding" | "birthday" | "gathering" | "work_event" | "custom";
export type DateMode = "decided" | "undecided";
export type LocationMode = "in_person" | "virtual" | "hybrid";
export type EventStatus = "draft" | "planning" | "confirmed" | "completed" | "archived";
export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type VendorStatus = "to_research" | "contacted" | "quote_received" | "shortlisted" | "selected" | "not_proceeding";
export type CostImpact = "low" | "medium" | "high" | "unknown";
export type RiskSeverity = "low" | "medium" | "high";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  passwordSalt?: string;
  avatarUrl?: string;
  locale: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  ownerId: string;
  brandName?: string;
  brandLogo?: string;
  brandColor?: string;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  status: "active" | "invited";
  user?: User;
  createdAt: string;
}

export interface Event {
  id: string;
  workspaceId: string;
  name: string;
  occasion: string;
  category: EventCategory;
  dateMode: DateMode;
  startDate?: string;
  endDate?: string;
  timezone: string;
  locationMode: LocationMode;
  locationAddress?: string;
  guestCount?: number;
  currency: string;
  targetBudget?: number; // In decimal units (e.g., 5000.00)
  style?: string;
  constraints?: string;
  createdBy: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

// Zod schema for structured AI plan output according to PRD section 8
export const EventPlanSchema = z.object({
  schemaVersion: z.literal("1"),
  summary: z.string(),
  assumptions: z.array(z.string()),
  openQuestions: z.array(z.string()),
  budget: z.object({
    currency: z.string(),
    target: z.number().optional(),
    items: z.array(
      z.object({
        id: z.string(),
        category: z.string(),
        label: z.string(),
        lowEstimate: z.number().optional(),
        likelyEstimate: z.number().optional(),
        highEstimate: z.number().optional(),
        rationale: z.string().optional(),
        isEstimate: z.literal(true),
      })
    ),
  }),
  tasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "critical"]),
      dueDate: z.string().optional(),
      dueOffsetDays: z.number().optional(),
      dependsOn: z.array(z.string()).default([]),
    })
  ),
  vendorCategories: z.array(
    z.object({
      category: z.string(),
      selectionCriteria: z.array(z.string()),
      questionsToAsk: z.array(z.string()),
    })
  ),
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      estimatedCostImpact: z.enum(["low", "medium", "high", "unknown"]).optional(),
    })
  ),
  risks: z.array(
    z.object({
      risk: z.string(),
      mitigation: z.string(),
    })
  ),
  runOfShow: z
    .array(
      z.object({
        time: z.string().optional(),
        activity: z.string(),
        owner: z.string().optional(),
      })
    )
    .optional(),
});

export type EventPlan = z.infer<typeof EventPlanSchema>;

export interface Plan {
  id: string;
  eventId: string;
  version: number;
  schemaVersion: "1";
  status: "draft" | "active" | "archived";
  summary: string;
  assumptions: string[];
  openQuestions: string[];
  content: EventPlan;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  ownerId?: string;
  ownerName?: string;
  dueDate?: string;
  dueOffsetDays?: number;
  dependsOn: string[];
  linkedVendorId?: string;
  linkedBudgetItemId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  eventId: string;
  category: string;
  label: string;
  lowEstimate?: number;
  likelyEstimate?: number;
  highEstimate?: number;
  quotedAmount?: number;
  committedAmount?: number;
  actualAmount?: number;
  currency: string;
  status: "estimated" | "quoted" | "committed" | "paid";
  linkedVendorId?: string;
  rationale?: string;
  isEstimate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  category: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  notes?: string;
  quoteAmount?: number;
  quoteCurrency?: string;
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  estimatedCostImpact: CostImpact;
  isAccepted: boolean;
  createdAt: string;
}

export interface Risk {
  id: string;
  eventId: string;
  risk: string;
  mitigation: string;
  severity: RiskSeverity;
  isResolved: boolean;
  createdAt: string;
}

export interface RunOfShowItem {
  id: string;
  eventId: string;
  timeLabel: string;
  activity: string;
  ownerName?: string;
  sortOrder: number;
  createdAt: string;
}

export interface Share {
  id: string;
  eventId: string;
  shareToken: string;
  role: "viewer" | "client";
  allowedSections: string[]; // ['summary', 'budget', 'timeline', 'vendors', 'ideas', 'runOfShow']
  expiresAt?: string;
  isRevoked: boolean;
  viewCount: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  workspaceId: string;
  tier: SubscriptionTier;
  status: "active" | "past_due" | "canceled";
  currentPeriodEnd: string;
  paymentProvider: string;
  externalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageLedger {
  id: string;
  workspaceId: string;
  feature: string;
  quantity: number;
  providerModel?: string;
  estimatedCost?: number;
  requestId: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  eventId?: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Entitlements {
  tier: SubscriptionTier;
  maxActiveEvents: number;
  maxGenerationsPerMonth: number;
  canExportProposals: boolean;
  canUseClientSharing: boolean;
  canUseCustomBranding: boolean;
  hasAgencyTemplates: boolean;
  currentActiveEvents: number;
  usedGenerationsThisMonth: number;
}
