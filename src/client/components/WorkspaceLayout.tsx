import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Share2,
  Download,
  Sparkles,
  Layers,
  FileSpreadsheet,
  CheckSquare,
  Building,
  Lightbulb,
  ShieldAlert,
  Clock,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  Event,
  Plan,
  BudgetItem,
  Task,
  Vendor,
  Idea,
  Risk,
  RunOfShowItem,
  Share,
} from "../../types/index.ts";
import { PlanView } from "./PlanView.tsx";
import { BudgetView } from "./BudgetView.tsx";
import { TasksView } from "./TasksView.tsx";
import { VendorsView } from "./VendorsView.tsx";
import { IdeasView } from "./IdeasView.tsx";
import { RisksView } from "./RisksView.tsx";
import { RunOfShowView } from "./RunOfShowView.tsx";
import { calculateBudgetTotals, formatMoney, toDecimal } from "../../utils/money.ts";

export type WorkspaceTab = "plan" | "budget" | "tasks" | "vendors" | "ideas" | "risks" | "runOfShow";

interface WorkspaceLayoutProps {
  event: Event;
  plan: Plan | null;
  budgetItems: BudgetItem[];
  tasks: Task[];
  vendors: Vendor[];
  ideas: Idea[];
  risks: Risk[];
  runOfShow: RunOfShowItem[];
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  onBackToLanding: () => void;
  onOpenAskFestiya: (prompt?: string) => void;
  onOpenShareModal: () => void;
  onOpenExportModal: () => void;
  onRegeneratePlan: () => void;
  isRegenerating: boolean;

  // Actions for subcomponents
  onAddBudgetItem: (item: Partial<BudgetItem>) => void;
  onUpdateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void;
  onDeleteBudgetItem: (id: string) => void;

  onAddTask: (task: Partial<Task>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;

  onAddVendor: (vendor: Partial<Vendor>) => void;
  onUpdateVendor: (id: string, updates: Partial<Vendor>) => void;
  onDeleteVendor: (id: string) => void;

  onAcceptIdea: (idea: Idea) => void;
  onToggleResolveRisk: (id: string, isResolved: boolean) => void;

  onAddRunOfShowItem: (item: Partial<RunOfShowItem>) => void;
  onDeleteRunOfShowItem: (id: string) => void;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  event,
  plan,
  budgetItems,
  tasks,
  vendors,
  ideas,
  risks,
  runOfShow,
  activeTab,
  setActiveTab,
  onBackToLanding,
  onOpenAskFestiya,
  onOpenShareModal,
  onOpenExportModal,
  onRegeneratePlan,
  isRegenerating,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  onAcceptIdea,
  onToggleResolveRisk,
  onAddRunOfShowItem,
  onDeleteRunOfShowItem,
}) => {
  const budgetTotals = calculateBudgetTotals(event.targetBudget, event.currency, budgetItems);
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const pendingTasks = tasks.filter((t) => t.status !== "done").length;

  const dateLabel = event.startDate
    ? `${event.startDate}${event.endDate ? ` to ${event.endDate}` : ""}`
    : "Date undecided (flexible timing)";

  const tabs: Array<{ key: WorkspaceTab; label: string; count?: number; icon: any }> = [
    { key: "plan", label: "Concept & Blueprint", icon: Layers },
    { key: "budget", label: "Budget Ledger", count: budgetItems.length, icon: FileSpreadsheet },
    { key: "tasks", label: "Timeline & Checklist", count: pendingTasks, icon: CheckSquare },
    { key: "vendors", label: "Partners & Quotes", count: vendors.length, icon: Building },
    { key: "ideas", label: "Curated Ideas", count: ideas.length, icon: Lightbulb },
    { key: "risks", label: "Contingencies", count: risks.length, icon: ShieldAlert },
    { key: "runOfShow", label: "Run-of-Show", count: runOfShow.length, icon: Clock },
  ];

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* 1. Event Command Header */}
      <section
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--surface-border)",
          padding: "24px 0 20px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="container">
          {/* Breadcrumb back */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "12.5px" }}>
            <button
              onClick={onBackToLanding}
              style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--ink-secondary)", cursor: "pointer" }}
            >
              <ArrowLeft size={14} />
              <span>Events Overview</span>
            </button>
            <ChevronRight size={12} color="var(--ink-muted)" />
            <span style={{ fontWeight: 600, color: "var(--ink)" }}>{event.name}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className="badge badge-coral" style={{ textTransform: "capitalize" }}>
                  {event.category.replace("_", " ")}
                </span>
                <span className="badge badge-mint" style={{ textTransform: "capitalize" }}>
                  {event.status}
                </span>
                <span className="badge badge-neutral">
                  {event.locationMode.replace("_", " ")}
                </span>
              </div>

              <h1 className="serif-heading" style={{ fontSize: "clamp(24px, 3.5vw, 34px)", color: "var(--ink)" }}>
                {event.name}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  flexWrap: "wrap",
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "var(--ink-secondary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Calendar size={14} color="var(--coral)" />
                  <span>{dateLabel}</span>
                </div>

                {event.locationAddress && (
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <MapPin size={14} color="var(--cobalt)" />
                    <span>{event.locationAddress}</span>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Users size={14} color="var(--berry)" />
                  <span>~{event.guestCount || "TBD"} guests</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <DollarSign size={14} color="var(--mint)" />
                  <span>Target: {formatMoney(event.targetBudget, event.currency)}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => onOpenAskFestiya()}
                className="btn btn-secondary"
                style={{ border: "1.5px solid var(--coral)", color: "var(--coral)" }}
              >
                <Sparkles size={16} />
                <span>Ask Festiya</span>
              </button>

              <button onClick={onOpenShareModal} className="btn btn-secondary">
                <Share2 size={16} />
                <span>Share Client Link</span>
              </button>

              <button onClick={onOpenExportModal} className="btn btn-secondary">
                <Download size={16} />
                <span>Export Proposal</span>
              </button>
            </div>
          </div>

          {/* 2. Operational Health Status Ribbon */}
          <div
            style={{
              marginTop: "20px",
              padding: "12px 18px",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--surface-border)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Committed vs Target Budget
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--ink)", marginTop: "2px" }}>
                {formatMoney(toDecimal(budgetTotals.committed), event.currency)} / {formatMoney(event.targetBudget, event.currency)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Budget Health
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: budgetTotals.status === "exceeded" ? "#E03131" : "var(--mint)",
                  marginTop: "2px",
                }}
              >
                {budgetTotals.status === "exceeded"
                  ? "Exceeded Target Limit"
                  : budgetTotals.status === "warning"
                  ? "Estimate Approaching Ceiling"
                  : "Within Safe Budget Cushion"}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Actionable Tasks
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", marginTop: "2px" }}>
                {completedTasks} completed • {pendingTasks} remaining
              </div>
            </div>

            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Confirmed Vendors
              </div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--cobalt)", marginTop: "2px" }}>
                {vendors.filter((v) => v.status === "selected").length} of {vendors.length} selected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section Navigation Tabs */}
      <div
        style={{
          background: "var(--canvas)",
          borderBottom: "1px solid var(--surface-border)",
          position: "sticky",
          top: "72px",
          zIndex: 90,
        }}
      >
        <div className="container" style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "8px 20px" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 16px",
                  borderRadius: "var(--radius-md)",
                  background: isActive ? "var(--ink)" : "var(--surface)",
                  color: isActive ? "#FFFFFF" : "var(--ink-secondary)",
                  border: isActive ? "1px solid var(--ink)" : "1px solid var(--surface-border)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                  minHeight: "40px",
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      background: isActive ? "rgba(255, 255, 255, 0.25)" : "var(--surface-alt)",
                      color: isActive ? "#FFF" : "var(--ink)",
                      fontWeight: 700,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tab Content Area */}
      <main className="container" style={{ paddingTop: "28px" }} id="main-content">
        {activeTab === "plan" && (
          <PlanView
            plan={plan}
            event={event}
            onOpenAskFestiya={onOpenAskFestiya}
            onRegenerate={onRegeneratePlan}
            isRegenerating={isRegenerating}
          />
        )}

        {activeTab === "budget" && (
          <BudgetView
            items={budgetItems}
            event={event}
            onAddItem={onAddBudgetItem}
            onUpdateItem={onUpdateBudgetItem}
            onDeleteItem={onDeleteBudgetItem}
            onOpenAskFestiya={onOpenAskFestiya}
          />
        )}

        {activeTab === "tasks" && (
          <TasksView
            tasks={tasks}
            event={event}
            onAddTask={onAddTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onOpenAskFestiya={onOpenAskFestiya}
          />
        )}

        {activeTab === "vendors" && (
          <VendorsView
            vendors={vendors}
            event={event}
            onAddVendor={onAddVendor}
            onUpdateVendor={onUpdateVendor}
            onDeleteVendor={onDeleteVendor}
            onOpenAskFestiya={onOpenAskFestiya}
          />
        )}

        {activeTab === "ideas" && (
          <IdeasView
            ideas={ideas}
            event={event}
            onAcceptIdea={onAcceptIdea}
            onOpenAskFestiya={onOpenAskFestiya}
          />
        )}

        {activeTab === "risks" && (
          <RisksView
            risks={risks}
            event={event}
            onToggleResolve={onToggleResolveRisk}
            onOpenAskFestiya={onOpenAskFestiya}
          />
        )}

        {activeTab === "runOfShow" && (
          <RunOfShowView
            items={runOfShow}
            event={event}
            onAddItem={onAddRunOfShowItem}
            onDeleteItem={onDeleteRunOfShowItem}
            onOpenAskFestiya={onOpenAskFestiya}
          />
        )}
      </main>
    </div>
  );
};
