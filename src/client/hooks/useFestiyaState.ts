import { useState, useEffect } from "react";
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
} from "../../types/index.ts";
import { WorkspaceTab } from "../components/WorkspaceLayout.tsx";
import { useEventOperations } from "./useEventOperations.ts";

export function useFestiyaState() {
  const [currentView, setCurrentView] = useState<"landing" | "workspace" | "pricing" | "shared">("landing");
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("plan");

  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);

  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [runOfShow, setRunOfShow] = useState<RunOfShowItem[]>([]);
  const [activeShare, setActiveShare] = useState<Share | null>(null);

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

  const [isEventBriefOpen, setIsEventBriefOpen] = useState(false);
  const [briefInitialValues, setBriefInitialValues] = useState<Record<string, unknown> | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingEventName, setGeneratingEventName] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAskFestiyaOpen, setIsAskFestiyaOpen] = useState(false);
  const [askFestiyaInitialPrompt, setAskFestiyaInitialPrompt] = useState("");
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const eventOps = useEventOperations({
    activeEvent,
    setBudgetItems,
    setTasks,
    setVendors,
    setIdeas,
    setRisks,
    setRunOfShow,
  });

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
      const evtRes = await fetch(`/api/events/${event.id}`);
      if (evtRes.ok) {
        const { plan } = await evtRes.json();
        setActivePlan(plan);
      }

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

      const shareRes = await fetch(`/api/shares/festiya-demo-jaipur-wedding-link`);
      if (shareRes.ok) {
        setActiveShare({
          id: "shr_demo",
          eventId: event.id,
          shareToken: "festiya-demo-jaipur-wedding-link",
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
        return;
      }
      alert("This share link is invalid or has expired.");
      window.history.replaceState({}, "", "/");
      loadInitialData();
    } catch (err) {
      console.error("Failed to load shared event:", err);
    }
  };

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

  const handleExploreDemoEvent = async (eventId: string) => {
    const wsType = eventId === "evt_apex_summit" ? "professional" : "personal";
    const targetWs = workspaces.find((w) => w.type === wsType);
    if (targetWs) {
      setActiveWorkspace(targetWs);
      await loadWorkspaceEvents(targetWs.id);
    }

    const evt = events.find((e) => e.id === eventId);
    if (evt) {
      await selectEvent(evt);
    }
    setCurrentView("workspace");
    setActiveTab("plan");
  };

  return {
    currentView,
    setCurrentView,
    activeTab,
    setActiveTab,
    user,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    events,
    activeEvent,
    entitlements,
    activePlan,
    budgetItems,
    tasks,
    vendors,
    ideas,
    risks,
    runOfShow,
    activeShare,
    sharedData,
    isEventBriefOpen,
    setIsEventBriefOpen,
    briefInitialValues,
    setBriefInitialValues,
    isGenerating,
    generatingEventName,
    isShareModalOpen,
    setIsShareModalOpen,
    isAskFestiyaOpen,
    setIsAskFestiyaOpen,
    askFestiyaInitialPrompt,
    setAskFestiyaInitialPrompt,
    isBillingModalOpen,
    setIsBillingModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    loadWorkspaceEvents,
    loadEntitlements,
    selectEvent,
    loadSharedEvent,
    handleCreateEvent,
    handleRegeneratePlan,
    handleRequestRevision,
    handleApplyProposedPlan,
    handleCreateShare,
    handleRevokeShare,
    handleUpgradeTier,
    handleDownloadProposalMarkdown,
    handleDownloadGdprJson,
    handleExploreDemoEvent,
    ...eventOps,
  };
}
