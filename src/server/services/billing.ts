/**
 * Festiya Billing & Entitlements Engine
 * Handles server-side tier limits, usage ledger metering,
 * and signed webhook verification.
 */

import { SubscriptionTier, Entitlements } from "../../types/index.ts";
import { DatabaseAdapter } from "../db/database.ts";

export const TIER_LIMITS: Record<
  SubscriptionTier,
  {
    maxActiveEvents: number;
    maxGenerationsPerMonth: number;
    canExportProposals: boolean;
    canUseClientSharing: boolean;
    canUseCustomBranding: boolean;
    hasAgencyTemplates: boolean;
  }
> = {
  free: {
    maxActiveEvents: 2,
    maxGenerationsPerMonth: 5,
    canExportProposals: false,
    canUseClientSharing: false,
    canUseCustomBranding: false,
    hasAgencyTemplates: false,
  },
  plus: {
    maxActiveEvents: 10,
    maxGenerationsPerMonth: 30,
    canExportProposals: true,
    canUseClientSharing: true,
    canUseCustomBranding: false,
    hasAgencyTemplates: false,
  },
  pro: {
    maxActiveEvents: 50,
    maxGenerationsPerMonth: 150,
    canExportProposals: true,
    canUseClientSharing: true,
    canUseCustomBranding: true,
    hasAgencyTemplates: true,
  },
  agency: {
    maxActiveEvents: 500,
    maxGenerationsPerMonth: 1000,
    canExportProposals: true,
    canUseClientSharing: true,
    canUseCustomBranding: true,
    hasAgencyTemplates: true,
  },
};

export async function getWorkspaceEntitlements(
  db: DatabaseAdapter,
  workspaceId: string
): Promise<Entitlements> {
  const workspace = await db.getWorkspace(workspaceId);
  const tier: SubscriptionTier = workspace?.subscriptionTier || "free";
  const limits = TIER_LIMITS[tier];

  const { totalGenerations, activeEvents } = await db.getUsageSummary(workspaceId);

  return {
    tier,
    ...limits,
    currentActiveEvents: activeEvents,
    usedGenerationsThisMonth: totalGenerations,
  };
}

export function canCreateEvent(entitlements: Entitlements): boolean {
  return entitlements.currentActiveEvents < entitlements.maxActiveEvents;
}

export function canGeneratePlan(entitlements: Entitlements): boolean {
  return entitlements.usedGenerationsThisMonth < entitlements.maxGenerationsPerMonth;
}
