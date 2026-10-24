/**
 * Festiya Proposal & Data Export Engine
 * Generates client-ready branded proposals and complete GDPR account exports.
 */

import { DatabaseAdapter } from "../db/database.ts";
import { formatMoney } from "../../utils/money.ts";

export async function generateClientProposalMarkdown(
  db: DatabaseAdapter,
  eventId: string
): Promise<string> {
  const event = await db.getEvent(eventId);
  if (!event) throw new Error("Event not found");

  const workspace = await db.getWorkspace(event.workspaceId);
  const plan = await db.getLatestPlan(eventId);
  const budgetItems = await db.listBudgetItems(eventId);
  const tasks = await db.listTasks(eventId);
  const vendors = await db.listVendors(eventId);
  const ideas = await db.listIdeas(eventId);
  const runOfShow = await db.listRunOfShow(eventId);

  const brandTitle = workspace?.brandName || workspace?.name || "Festiya Events";
  const dateStr = event.startDate ? `${event.startDate}${event.endDate ? ` to ${event.endDate}` : ""}` : "Date Pending Confirmation";

  let md = `# ${event.name}\n`;
  md += `**Occasion:** ${event.occasion}  \n`;
  md += `**Presented by:** ${brandTitle}  \n`;
  md += `**Date:** ${dateStr}  \n`;
  md += `**Location:** ${event.locationAddress || "Selected Destination"} (${event.locationMode.replace("_", " ")})  \n`;
  md += `**Guest Count:** ~${event.guestCount || "TBD"} guests  \n`;
  md += `**Target Budget:** ${formatMoney(event.targetBudget, event.currency)}  \n\n`;
  md += `---\n\n`;

  if (plan) {
    md += `## Executive Summary\n\n${plan.summary}\n\n`;

    if (plan.assumptions?.length) {
      md += `### Planning Assumptions\n`;
      for (const a of plan.assumptions) {
        md += `- ${a}\n`;
      }
      md += `\n`;
    }
  }

  if (budgetItems.length) {
    md += `## Budget Allocation\n\n`;
    md += `| Category | Description | Estimate | Quoted | Status |\n`;
    md += `|---|---|---|---|---|\n`;
    for (const b of budgetItems) {
      const est = formatMoney(b.likelyEstimate || b.lowEstimate, b.currency);
      const quot = b.quotedAmount ? formatMoney(b.quotedAmount, b.currency) : "—";
      md += `| ${b.category} | ${b.label} | ${est} | ${quot} | ${b.status} |\n`;
    }
    md += `\n`;
  }

  if (tasks.length) {
    md += `## Milestone Timeline & Next Actions\n\n`;
    for (const t of tasks) {
      const statusIcon = t.status === "done" ? "[x]" : "[ ]";
      const due = t.dueDate ? ` (Due: ${t.dueDate})` : "";
      md += `- ${statusIcon} **${t.title}**${due} — *${t.priority} priority*\n`;
      if (t.description) md += `  ${t.description}\n`;
    }
    md += `\n`;
  }

  if (vendors.length) {
    md += `## Partner & Vendor Network\n\n`;
    for (const v of vendors) {
      md += `### ${v.name} (${v.category})\n`;
      md += `- **Status:** ${v.status.replace("_", " ")}\n`;
      if (v.contactName) md += `- **Contact:** ${v.contactName} (${v.contactEmail || v.contactPhone || "—"})\n`;
      if (v.quoteAmount) md += `- **Quote:** ${formatMoney(v.quoteAmount, v.quoteCurrency || event.currency)}\n`;
      if (v.notes) md += `- **Notes:** ${v.notes}\n`;
      md += `\n`;
    }
  }

  if (runOfShow.length) {
    md += `## Event Schedule (Run-of-Show)\n\n`;
    md += `| Time | Activity | Lead |\n`;
    md += `|---|---|---|\n`;
    for (const ros of runOfShow) {
      md += `| ${ros.timeLabel} | ${ros.activity} | ${ros.ownerName || "—"} |\n`;
    }
    md += `\n`;
  }

  if (ideas.length) {
    md += `## Curated Experiences & Ideas\n\n`;
    for (const i of ideas) {
      md += `- **${i.title}** (${i.category}): ${i.description}\n`;
    }
    md += `\n`;
  }

  md += `---\n*Generated with Festiya — Make a moment of it.*\n`;
  return md;
}

export async function exportUserData(db: DatabaseAdapter, userId: string): Promise<Record<string, unknown>> {
  const user = await db.getUser(userId);
  if (!user) throw new Error("User not found");

  const workspaces = await db.listWorkspacesForUser(userId);
  const workspaceData = await Promise.all(
    workspaces.map(async (ws) => {
      const [events, members, subscription] = await Promise.all([
        db.listEvents(ws.id),
        db.listWorkspaceMembers(ws.id),
        db.getSubscription(ws.id),
      ]);

      const eventsData = await Promise.all(
        events.map(async (evt) => {
          const [plan, tasks, budgetItems, vendors, ideas, risks, runOfShow] = await Promise.all([
            db.getLatestPlan(evt.id),
            db.listTasks(evt.id),
            db.listBudgetItems(evt.id),
            db.listVendors(evt.id),
            db.listIdeas(evt.id),
            db.listRisks(evt.id),
            db.listRunOfShow(evt.id),
          ]);

          return {
            event: evt,
            plan,
            tasks,
            budgetItems,
            vendors,
            ideas,
            risks,
            runOfShow,
          };
        })
      );

      return {
        workspace: ws,
        subscription,
        members,
        events: eventsData,
      };
    })
  );

  return {
    exportedAt: new Date().toISOString(),
    user,
    workspaces: workspaceData,
  };
}
