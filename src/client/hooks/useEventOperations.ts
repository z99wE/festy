import {
  BudgetItem,
  Task,
  Vendor,
  Idea,
  Risk,
  RunOfShowItem,
  Event,
} from "../../types/index.ts";

interface UseEventOperationsProps {
  activeEvent: Event | null;
  setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  setRisks: React.Dispatch<React.SetStateAction<Risk[]>>;
  setRunOfShow: React.Dispatch<React.SetStateAction<RunOfShowItem[]>>;
}

export function useEventOperations({
  activeEvent,
  setBudgetItems,
  setTasks,
  setVendors,
  setIdeas,
  setRisks,
  setRunOfShow,
}: UseEventOperationsProps) {
  // Budget
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

  // Tasks
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

  // Vendors
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

  // Ideas & Risks
  const handleAcceptIdea = async (idea: Idea) => {
    if (!activeEvent) return;
    await fetch(`/api/events/${activeEvent.id}/ideas/${idea.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAccepted: true }),
    });
    setIdeas((prev) => prev.map((i) => (i.id === idea.id ? { ...i, isAccepted: true } : i)));

    await handleAddTask({
      title: `Implement Idea: ${idea.title}`,
      description: idea.description,
      priority: idea.estimatedCostImpact === "high" ? "high" : "medium",
      status: "todo",
    });
  };

  const handleToggleResolveRisk = async (id: string, isResolved: boolean) => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, isResolved } : r)));
  };

  // Run of Show
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

  return {
    handleAddBudgetItem,
    handleUpdateBudgetItem,
    handleDeleteBudgetItem,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAddVendor,
    handleUpdateVendor,
    handleDeleteVendor,
    handleAcceptIdea,
    handleToggleResolveRisk,
    handleAddRunOfShowItem,
    handleDeleteRunOfShowItem,
  };
}
