import React, { useEffect, useState } from "react";
import {
  User,
  Workspace,
  Event,
  Plan,
  BudgetItem,
  Task,
  Vendor,
  Idea,
  Risk,
  RunOfShowItem,
  Share,
  Entitlements,
  SubscriptionTier,
  EventPlan,
} from "../types/index.ts";
import { Navbar } from "./components/Navbar.tsx";
import { Footer } from "./components/Footer.tsx";
import { LandingPage } from "./components/LandingPage.tsx";
import { WorkspaceLayout, WorkspaceTab } from "./components/WorkspaceLayout.tsx";
import { EventBriefModal } from "./components/EventBriefModal.tsx";
import { GeneratingPlanModal } from "./components/GeneratingPlanModal.tsx";
import { ClientShareModal } from "./components/ClientShareModal.tsx";
import { AskFestiyaDrawer } from "./components/AskFestiyaDrawer.tsx";
import { BillingPortalModal } from "./components/BillingPortalModal.tsx";
import { AccountExportModal } from "./components/AccountExportModal.tsx";
import { SharedEventView } from "./components/SharedEventView.tsx";

export const App: React.FC = () => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<"landing" | "workspace" | "pricing" | "shared">("landing");
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("plan");

  // Core Data State
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);

  // Active Event Detailed Data
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [runOfShow, setRunOfShow] = useState<RunOfShowItem[]>([]);
  const [activeShare, setActiveShare] = useState<Share | null>(null);

  // Shared Preview View State
  const [sharedData, setSharedData] = useState<{
    event: Event;
    plan: Plan | null;
    budgetItems: BudgetItem[];
    tasks: Task[];
    vendors: Vendor[];
    ideas: Idea[];
    runOfShow: RunOfShowItem[];
    allowedSections: string[];
    role: string;
  } | null>(null);

  // Modals & Drawers
  const [isEventBriefOpen, setIsEventBriefOpen] = useState(false);
  const [briefInitialValues, setBriefInitialValues] = useState<Record<string, unknown> | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingEventName, setGeneratingEventName] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAskFestiyaOpen, setIsAskFestiyaOpen] = useState(false);
  const [askFestiyaInitialPrompt, setAskFestiyaInitialPrompt] = useState("");
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize and check URL query params for share link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareToken = params.get("share");
    if (shareToken) {
      loadSharedEvent(shareToken);
    } else {
      loadInitialData();
    }
  }, []);

  const loadInitialData = async () => {
    try {
      const meRes = await fetch("/api/me");
      if (meRes.ok) {
        const { user } = await meRes.json();
        setUser(user);
      }

      const wsRes = await fetch("/api/workspaces");
      if (wsRes.ok) {
        const { workspaces } = await wsRes.json();
        setWorkspaces(workspaces);
        if (workspaces.length > 0) {
          const defaultWs = workspaces[0];
          setActiveWorkspace(defaultWs);
          await loadWorkspaceEvents(defaultWs.id);
          await loadEntitlements(defaultWs.id);
        }
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    }
  };

  const loadWorkspaceEvents = async (wsId: string) => {
    try {
      const res = await fetch(`/api/workspaces/${wsId}/events`);
      if (res.ok) {
        const { events } = await res.json();
        setEvents(events);
        if (events.length > 0) {
          await selectEvent(events[0]);
        } else {
          setActiveEvent(null);
          setActivePlan(null);
        }
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  const loadEntitlements = async (wsId: string) => {
    try {
      const res = await fetch(`/api/billing/entitlements?workspaceId=${wsId}`);
      if (res.ok) {
        const { entitlements } = await res.json();
        setEntitlements(entitlements);
      }
    } catch (err) {
      console.error("Failed to load entitlements:", err);
    }
  };

  const selectEvent = async (event: Event) => {
    setActiveEvent(event);
    try {
      // Load event details & plan
      const evtRes = await fetch(`/api/events/${event.id}`);
      if (evtRes.ok) {
        const { plan } = await evtRes.json();
        setActivePlan(plan);
      }

      // Load sub-collections in parallel
      const [bRes, tRes, vRes, iRes, rRes, rosRes] = await Promise.all([
        fetch(`/api/events/${event.id}/budget-items`),
        fetch(`/api/events/${event.id}/tasks`),
        fetch(`/api/events/${event.id}/vendors`),
        fetch(`/api/events/${event.id}/ideas`),
        fetch(`/api/events/${event.id}/risks`),
        fetch(`/api/events/${event.id}/run-of-show`),
      ]);

      if (bRes.ok) setBudgetItems((await bRes.json()).items);
      if (tRes.ok) setTasks((await tRes.json()).tasks);
      if (vRes.ok) setVendors((await vRes.json()).vendors);
      if (iRes.ok) setIdeas((await iRes.json()).ideas);
      if (rRes.ok) setRisks((await rRes.json()).risks);
      if (rosRes.ok) setRunOfShow((await rosRes.json()).items);

      // Check active share link
      const shareRes = await fetch(`/api/shares/festiya-demo-jaipur-wedding-link`);
      if (shareRes.ok) {
        setActiveShare({
          id: "shr_demo",
          eventId: event.id,
          shareToken: "festiya-demo-jaipur-wedding-link", // dummy placeholder demo link
          role: "client",
          allowedSections: ["summary", "budget", "timeline", "vendors", "ideas", "runOfShow"],
          isRevoked: false,
          viewCount: 14,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Failed to load event details:", err);
    }
  };

  const loadSharedEvent = async (token: string) => {
    try {
      const res = await fetch(`/api/shares/${token}`);
      if (res.ok) {
        const data = await res.json();
        setSharedData(data);
        setCurrentView("shared");
      } else {
        alert("This share link is invalid or has expired.");
        window.history.replaceState({}, "", "/");
        loadInitialData();
      }
    } catch (err) {
      console.error("Failed to load shared event:", err);
    }
  };

  // Event Creation & AI Plan Generation Pipeline
  const handleCreateEvent = async (data: {
    name: string;
    occasion: string;
    category: any;
    dateMode: any;
    startDate?: string;
    endDate?: string;
    locationMode: any;
    locationAddress?: string;
    guestCount?: number;
    currency: string;
    targetBudget?: number;
    style?: string;
    constraints?: string;
    generateImmediately: boolean;
  }) => {
    if (!activeWorkspace) return;
    setIsEventBriefOpen(false);

    try {
      const createRes = await fetch(`/api/workspaces/${activeWorkspace.id}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        alert(err.error || "Failed to create event");
        return;
      }

      const { event } = await createRes.json();
      setEvents((prev) => [event, ...prev]);
      setActiveEvent(event);

      if (data.generateImmediately) {
        setGeneratingEventName(event.name);
        setIsGenerating(true);

        const genRes = await fetch(`/api/events/${event.id}/plan/generate`, {
          method: "POST",
        });

        if (genRes.ok) {
          const { plan } = await genRes.json();
          setActivePlan(plan);
          await selectEvent(event);
        }
        setIsGenerating(false);
      }

      setCurrentView("workspace");
      setActiveTab("plan");
      await loadEntitlements(activeWorkspace.id);
    } catch (err) {
      console.error("Create event error:", err);
      setIsGenerating(false);
    }
  };

  // Regenerate / Synthesize Plan
  const handleRegeneratePlan = async () => {
    if (!activeEvent) return;
    setIsGenerating(true);
    setGeneratingEventName(activeEvent.name);
    try {
      const res = await fetch(`/api/events/${activeEvent.id}/plan/generate`, {
        method: "POST",
      });
      if (res.ok) {
        const { plan } = await res.json();
        setActivePlan(plan);
        await selectEvent(activeEvent);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Ask Festiya Revision Handlers
  const handleRequestRevision = async (instruction: string) => {
    if (!activeEvent) throw new Error("No active event");
    const res = await fetch(`/api/events/${activeEvent.id}/plan/revise`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction }),
    });
    if (!res.ok) throw new Error("Revision failed");
    const data = await res.json();
    return {
      plan: data.plan.content as EventPlan,
      providerUsed: data.metadata.providerUsed,
    };
  };

  const handleApplyProposedPlan = async (newPlan: EventPlan) => {
    if (!activeEvent || !activePlan) return;
    setActivePlan({
      ...activePlan,
      summary: newPlan.summary,
      assumptions: newPlan.assumptions,
      openQuestions: newPlan.openQuestions,
      content: newPlan,
      version: activePlan.version + 1,
    });
    if (newPlan.budget.target) {
      setActiveEvent({ ...activeEvent, targetBudget: newPlan.budget.target });
    }
  };

  // Budget Actions
  const handleAddBudgetItem = async (item: Partial<BudgetItem>) => {
    if (!activeEvent) return;
    const res = await fetch(`/api/events/${activeEvent.id}/budget-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const { item: saved } = await res.json();
      setBudgetItems((prev) => [...prev, saved]);
    }
  };

  const handleUpdateBudgetItem = async (id: string, updates: Partial<BudgetItem>) => {
    const res = await fetch(`/api/events/${activeEvent?.id}/budget-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const { item: updated } = await res.json();
      setBudgetItems((prev) => prev.map((b) => (b.id === id ? updated : b)));
    }
  };

  const handleDeleteBudgetItem = async (id: string) => {
    const res = await fetch(`/api/events/${activeEvent?.id}/budget-items/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setBudgetItems((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Task Actions
  const handleAddTask = async (task: Partial<Task>) => {
    if (!activeEvent) return;
    const res = await fetch(`/api/events/${activeEvent.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      const { task: saved } = await res.json();
      setTasks((prev) => [...prev, saved]);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    const res = await fetch(`/api/events/${activeEvent?.id}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const { task: updated } = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const handleDeleteTask = async (id: string) => {
    const res = await fetch(`/api/events/${activeEvent?.id}/tasks/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Vendor Actions
  const handleAddVendor = async (vendor: Partial<Vendor>) => {
    if (!activeEvent) return;
    const res = await fetch(`/api/events/${activeEvent.id}/vendors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vendor),
    });
    if (res.ok) {
      const { vendor: saved } = await res.json();
      setVendors((prev) => [...prev, saved]);
    }
  };

  const handleUpdateVendor = async (id: string, updates: Partial<Vendor>) => {
    const res = await fetch(`/api/events/${activeEvent?.id}/vendors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const { vendor: updated } = await res.json();
      setVendors((prev) => prev.map((v) => (v.id === id ? updated : v)));
    }
  };

  const handleDeleteVendor = async (id: string) => {
    const res = await fetch(`/api/events/${activeEvent?.id}/vendors/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setVendors((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // Ideas Acceptance Action -> Converts idea into planned task!
  const handleAcceptIdea = async (idea: Idea) => {
    if (!activeEvent) return;
    await fetch(`/api/events/${activeEvent.id}/ideas/${idea.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAccepted: true }),
    });
    setIdeas((prev) => prev.map((i) => (i.id === idea.id ? { ...i, isAccepted: true } : i)));

    // Automatically create linked actionable task
    await handleAddTask({
      title: `Implement Idea: ${idea.title}`,
      description: idea.description,
      priority: idea.estimatedCostImpact === "high" ? "high" : "medium",
      status: "todo",
    });
  };

  // Risk Resolution Action
  const handleToggleResolveRisk = async (id: string, isResolved: boolean) => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, isResolved } : r)));
  };

  // Run of Show Actions
  const handleAddRunOfShowItem = async (item: Partial<RunOfShowItem>) => {
    if (!activeEvent) return;
    const res = await fetch(`/api/events/${activeEvent.id}/run-of-show`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (res.ok) {
      const { item: saved } = await res.json();
      setRunOfShow((prev) => [...prev, saved]);
    }
  };

  const handleDeleteRunOfShowItem = async (id: string) => {
    setRunOfShow((prev) => prev.filter((r) => r.id !== id));
  };

  // Sharing Links
  const handleCreateShare = async (sections: string[]) => {
    if (!activeEvent) return;
    const res = await fetch(`/api/events/${activeEvent.id}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "client", allowedSections: sections }),
    });
    if (res.ok) {
      const { share } = await res.json();
      setActiveShare(share);
    }
  };

  const handleRevokeShare = async (shareId: string) => {
    const res = await fetch(`/api/shares/${shareId}`, { method: "DELETE" });
    if (res.ok) {
      setActiveShare(null);
    }
  };

  // Tier Upgrade Simulation
  const handleUpgradeTier = async (targetTier: SubscriptionTier) => {
    if (!activeWorkspace) return;
    const res = await fetch("/api/billing/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: activeWorkspace.id,
        tier: targetTier,
        status: "active",
      }),
    });
    if (res.ok) {
      setActiveWorkspace({ ...activeWorkspace, subscriptionTier: targetTier });
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === activeWorkspace.id ? { ...w, subscriptionTier: targetTier } : w))
      );
      await loadEntitlements(activeWorkspace.id);
      setIsBillingModalOpen(false);
      alert(`Workspace successfully upgraded to ${targetTier.toUpperCase()}! Entitlements and quotas expanded.`);
    }
  };

  // Downloads: Proposal Markdown & GDPR JSON
  const handleDownloadProposalMarkdown = async () => {
    if (!activeEvent) return;
    const res = await fetch(`/api/events/${activeEvent.id}/export/proposal`);
    if (res.ok) {
      const text = await res.text();
      const blob = new Blob([text], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeEvent.name.replace(/\s+/g, "_")}_Proposal.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadGdprJson = async () => {
    const res = await fetch("/api/account/export", { method: "POST" });
    if (res.ok) {
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Festiya_Account_Export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Switch to demo event
  const handleExploreDemoEvent = async (eventId: string) => {
    // If event is in corporate/agency workspace, switch workspace first
    if (eventId === "evt_apex_summit") {
      const agencyWs = workspaces.find((w) => w.type === "professional");
      if (agencyWs) {
        setActiveWorkspace(agencyWs);
        await loadWorkspaceEvents(agencyWs.id);
      }
    } else {
      const personalWs = workspaces.find((w) => w.type === "personal");
      if (personalWs) {
        setActiveWorkspace(personalWs);
        await loadWorkspaceEvents(personalWs.id);
      }
    }

    const evt = events.find((e) => e.id === eventId);
    if (evt) {
      await selectEvent(evt);
    }
    setCurrentView("workspace");
    setActiveTab("plan");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Shared Read-only View check */}
      {currentView === "shared" && sharedData ? (
        <SharedEventView
          event={sharedData.event}
          plan={sharedData.plan}
          budgetItems={sharedData.budgetItems}
          tasks={sharedData.tasks}
          vendors={sharedData.vendors}
          ideas={sharedData.ideas}
          runOfShow={sharedData.runOfShow}
          allowedSections={sharedData.allowedSections}
          role={sharedData.role}
          onExitPreview={() => {
            setCurrentView("workspace");
            window.history.replaceState({}, "", "/");
          }}
        />
      ) : (
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            workspaces={workspaces}
            activeWorkspace={activeWorkspace}
            onSelectWorkspace={async (ws) => {
              setActiveWorkspace(ws);
              await loadWorkspaceEvents(ws.id);
              await loadEntitlements(ws.id);
            }}
            events={events}
            activeEvent={activeEvent}
            onSelectEvent={selectEvent}
            onOpenNewEventModal={() => {
              setBriefInitialValues(undefined);
              setIsEventBriefOpen(true);
            }}
            onOpenBillingModal={() => setIsBillingModalOpen(true)}
          />

          {/* Main Content Router */}
          {currentView === "landing" && (
            <LandingPage
              onStartPlan={(brief) => {
                setBriefInitialValues(brief);
                setIsEventBriefOpen(true);
              }}
              onExploreDemoEvent={handleExploreDemoEvent}
              onGoToPricing={() => setIsBillingModalOpen(true)}
              availableEvents={events}
            />
          )}

          {currentView === "workspace" && activeEvent && (
            <WorkspaceLayout
              event={activeEvent}
              plan={activePlan}
              budgetItems={budgetItems}
              tasks={tasks}
              vendors={vendors}
              ideas={ideas}
              risks={risks}
              runOfShow={runOfShow}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onBackToLanding={() => setCurrentView("landing")}
              onOpenAskFestiya={(prompt) => {
                setAskFestiyaInitialPrompt(prompt || "");
                setIsAskFestiyaOpen(true);
              }}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onRegeneratePlan={handleRegeneratePlan}
              isRegenerating={isGenerating}
              onAddBudgetItem={handleAddBudgetItem}
              onUpdateBudgetItem={handleUpdateBudgetItem}
              onDeleteBudgetItem={handleDeleteBudgetItem}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddVendor={handleAddVendor}
              onUpdateVendor={handleUpdateVendor}
              onDeleteVendor={handleDeleteVendor}
              onAcceptIdea={handleAcceptIdea}
              onToggleResolveRisk={handleToggleResolveRisk}
              onAddRunOfShowItem={handleAddRunOfShowItem}
              onDeleteRunOfShowItem={handleDeleteRunOfShowItem}
            />
          )}

          {currentView === "pricing" && (
            <div className="container" style={{ padding: "60px 20px" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 className="serif-heading" style={{ fontSize: "36px", marginBottom: "12px" }}>
                  Workspace Plans & Entitlements
                </h1>
                <p style={{ color: "var(--ink-secondary)", fontSize: "16px" }}>
                  Scale from personal celebrations to multi-planner agencies with transparent limits.
                </p>
              </div>

              {activeWorkspace && (
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <button
                    aria-label="Open billing and subscription manager"
                    onClick={() => setIsBillingModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Open Billing & Subscription Manager
                  </button>
                </div>
              )}
            </div>
          )}

          <Footer
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenPricing={() => setIsBillingModalOpen(true)}
          />

          {/* Modals & Drawers */}
          <EventBriefModal
            isOpen={isEventBriefOpen}
            onClose={() => setIsEventBriefOpen(false)}
            onSubmit={handleCreateEvent}
            initialValues={briefInitialValues as any}
          />

          <GeneratingPlanModal
            isOpen={isGenerating}
            eventName={generatingEventName}
          />

          {activeEvent && (
            <>
              <ClientShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                event={activeEvent}
                share={activeShare}
                onCreateShare={handleCreateShare}
                onRevokeShare={handleRevokeShare}
                onOpenPreview={(token) => {
                  setIsShareModalOpen(false);
                  loadSharedEvent(token);
                }}
              />

              <AskFestiyaDrawer
                isOpen={isAskFestiyaOpen}
                onClose={() => setIsAskFestiyaOpen(false)}
                event={activeEvent}
                initialPrompt={askFestiyaInitialPrompt}
                onRequestRevision={handleRequestRevision}
                onApplyPlan={handleApplyProposedPlan}
              />

              <AccountExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                event={activeEvent}
                onDownloadProposalMarkdown={handleDownloadProposalMarkdown}
                onDownloadGdprJson={handleDownloadGdprJson}
              />
            </>
          )}

          {activeWorkspace && (
            <BillingPortalModal
              isOpen={isBillingModalOpen}
              onClose={() => setIsBillingModalOpen(false)}
              workspace={activeWorkspace}
              entitlements={entitlements}
              onUpgradeTier={handleUpgradeTier}
            />
          )}
        </>
      )}
    </div>
  );
};
