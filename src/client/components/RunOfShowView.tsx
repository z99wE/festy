import React, { useState } from "react";
import { Plus, Clock, User, Trash2 } from "lucide-react";
import { RunOfShowItem, Event } from "../../types/index.ts";

interface RunOfShowViewProps {
  items: RunOfShowItem[];
  event: Event;
  onAddItem: (item: Partial<RunOfShowItem>) => void;
  onDeleteItem: (id: string) => void;
  onOpenAskFestiya: (prompt?: string) => void;
}

export const RunOfShowView: React.FC<RunOfShowViewProps> = ({
  items,
  event,
  onAddItem,
  onDeleteItem,
  onOpenAskFestiya,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState("17:00");
  const [newActivity, setNewActivity] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      timeLabel: newTime,
      activity: newActivity || "Activity",
      ownerName: newOwner || undefined,
      sortOrder: items.length,
    });
    setNewActivity("");
    setNewOwner("");
    setShowAddModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Day-of Operations (Run-of-Show)</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-secondary)", marginTop: "2px" }}>
              Minute-by-minute cues for hosts, catering staff, AV crew, and performers.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              aria-label="Suggest schedule"
              onClick={() => onOpenAskFestiya("Suggest a seamless evening run-of-show schedule for this event")}
              className="btn btn-secondary btn-sm"
            >
              Suggest schedule
            </button>
            <button
              aria-label="Add schedule cue"
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} />
              <span>Add schedule cue</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
            <thead>
              <tr style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--surface-border)" }}>
                <th style={{ padding: "14px 18px", textAlign: "left", width: "120px" }}>Time</th>
                <th style={{ padding: "14px 18px", textAlign: "left" }}>Activity / Cue</th>
                <th style={{ padding: "14px 18px", textAlign: "left", width: "200px" }}>Designated Lead</th>
                <th style={{ padding: "14px 18px", textAlign: "right", width: "80px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--surface-border)" }}>
                  <td style={{ padding: "14px 18px", fontWeight: 800, color: "var(--coral)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={14} />
                    <span>{item.timeLabel}</span>
                  </td>
                  <td style={{ padding: "14px 18px", fontWeight: 600, color: "var(--ink)" }}>
                    {item.activity}
                  </td>
                  <td style={{ padding: "14px 18px", color: "var(--ink-secondary)" }}>
                    {item.ownerName ? (
                      <span className="badge badge-neutral" style={{ fontSize: "12px" }}>
                        👤 {item.ownerName}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      style={{ color: "var(--ink-muted)", padding: "4px" }}
                      aria-label="Delete cue"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close schedule cue modal overlay"
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowAddModal(false);
          }}
        >
          <div className="modal-content" style={{ maxWidth: "440px" }} role="dialog" aria-modal="true">
            <h3 className="serif-heading" style={{ fontSize: "20px", marginBottom: "16px" }}>
              Add Schedule Cue
            </h3>
            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label htmlFor="cue-time" className="form-label">Time</label>
                <input
                  id="cue-time"
                  aria-label="Cue time"
                  className="form-input"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 18:30"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cue-activity" className="form-label">Activity / Cue</label>
                <input
                  id="cue-activity"
                  aria-label="Activity or cue"
                  className="form-input"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="e.g. Champagne toast and welcome remarks"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cue-owner" className="form-label">Lead / Owner</label>
                <input
                  id="cue-owner"
                  aria-label="Lead or owner"
                  className="form-input"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button aria-label="Cancel" type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button aria-label="Save cue" type="submit" className="btn btn-primary">
                  Save Cue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
