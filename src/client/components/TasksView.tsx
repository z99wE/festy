import React, { useState } from "react";
import { Plus, CheckSquare, Square, AlertCircle, Clock, Trash2, Filter } from "lucide-react";
import { Task, TaskPriority, TaskStatus, Event } from "../../types/index.ts";

interface TasksViewProps {
  tasks: Task[];
  event: Event;
  onAddTask: (task: Partial<Task>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onOpenAskFestiya: (prompt?: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  event,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onOpenAskFestiya,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "all") return true;
    return t.status === filterStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title: newTitle || "New Task",
      description: newDescription || undefined,
      priority: newPriority,
      status: "todo",
      dueDate: newDueDate || undefined,
      ownerName: newOwner || undefined,
      dependsOn: [],
    });
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    setNewDueDate("");
    setNewOwner("");
    setShowAddModal(false);
  };

  const priorityBadges: Record<TaskPriority, { class: string; label: string }> = {
    critical: { class: "badge-coral", label: "Critical" },
    high: { class: "badge-sunshine", label: "High" },
    medium: { class: "badge-cobalt", label: "Medium" },
    low: { class: "badge-neutral", label: "Low" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Progress & Quick stats bar */}
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>
              Execution Progress: {completedCount} of {tasks.length} tasks completed ({progressPercent}%)
            </div>
            <p style={{ fontSize: "12px", color: "var(--ink-secondary)", marginTop: "2px" }}>
              Keep everyone aligned with clear milestones and owners.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              aria-label="Suggest missing tasks"
              onClick={() => onOpenAskFestiya("Suggest missing tasks based on current plan and timeline")}
              className="btn btn-secondary btn-sm"
            >
              Suggest missing tasks
            </button>
            <button
              aria-label="Add task"
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} />
              <span>Add task</span>
            </button>
          </div>
        </div>

        {/* Progress Track */}
        <div
          style={{
            height: "8px",
            background: "var(--surface-alt)",
            borderRadius: "var(--radius-full)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, var(--coral) 0%, var(--mint) 100%)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["all", "todo", "in_progress", "done"].map((status) => (
          <button
            key={status}
            aria-label={`Filter by ${status.replace("_", " ")}`}
            onClick={() => setFilterStatus(status)}
            className={`btn btn-sm ${filterStatus === status ? "btn-secondary" : ""}`}
            style={{ textTransform: "capitalize", fontWeight: 600 }}
          >
            {status.replace("_", " ")} (
            {status === "all" ? tasks.length : tasks.filter((t) => t.status === status).length})
          </button>
        ))}
      </div>

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredTasks.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ color: "var(--ink-muted)", fontSize: "14px" }}>
              No tasks matching this filter.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === "done";
            const pBadge = priorityBadges[task.priority];

            return (
              <div
                key={task.id}
                className="card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  opacity: isDone ? 0.75 : 1,
                  background: isDone ? "#FBFAF8" : "var(--surface)",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Status Toggle Checkbox */}
                <button
                  aria-label={isDone ? "Mark todo" : "Mark done"}
                  onClick={() =>
                    onUpdateTask(task.id, {
                      status: isDone ? "todo" : "done",
                    })
                  }
                  style={{
                    color: isDone ? "var(--mint)" : "var(--ink-muted)",
                    padding: "2px",
                    cursor: "pointer",
                    marginTop: "2px",
                  }}
                >
                  {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "var(--ink)",
                        textDecoration: isDone ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </span>
                    <span className={`badge ${pBadge.class}`}>{pBadge.label}</span>
                    {task.ownerName && (
                      <span className="badge badge-neutral" style={{ fontSize: "11px" }}>
                        👤 {task.ownerName}
                      </span>
                    )}
                  </div>

                  {task.description && (
                    <p style={{ fontSize: "13px", color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                      {task.description}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "14px", marginTop: "8px", fontSize: "12px", color: "var(--ink-muted)" }}>
                    {task.dueDate && (
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={13} />
                        Due: {task.dueDate}
                      </span>
                    )}
                    {task.dueOffsetDays !== undefined && (
                      <span>
                        Offset: {task.dueOffsetDays < 0 ? `T${task.dueOffsetDays} days` : `+${task.dueOffsetDays} days`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    style={{ color: "var(--ink-muted)", padding: "4px" }}
                    aria-label="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close add task modal overlay"
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowAddModal(false);
          }}
        >
          <div className="modal-content" style={{ maxWidth: "480px" }} role="dialog" aria-modal="true">
            <h3 className="serif-heading" style={{ fontSize: "20px", marginBottom: "16px" }}>
              Add New Task
            </h3>
            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label htmlFor="task-new-title" className="form-label">Task Title</label>
                <input
                  id="task-new-title"
                  aria-label="Task title"
                  className="form-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Schedule final floral walkthrough"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-new-desc" className="form-label">Description / Instructions</label>
                <textarea
                  id="task-new-desc"
                  className="form-textarea"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Notes, key questions, or phone numbers"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label htmlFor="task-new-priority" className="form-label">Priority</label>
                  <select
                    id="task-new-priority"
                    className="form-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="task-new-due-date" className="form-label">Due Date</label>
                  <input
                    id="task-new-due-date"
                    aria-label="Due date"
                    type="date"
                    className="form-input"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="task-new-owner" className="form-label">Assignee / Owner Name</label>
                <input
                  id="task-new-owner"
                  aria-label="Assignee or owner name"
                  className="form-input"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="e.g. Elena Rostova or Souvik"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button aria-label="Cancel" type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button aria-label="Save task" type="submit" className="btn btn-primary">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
