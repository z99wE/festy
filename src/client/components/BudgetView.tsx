import React, { useState } from "react";
import { Plus, AlertTriangle, CheckCircle2, TrendingUp, DollarSign, Edit3, Trash2 } from "lucide-react";
import { BudgetItem, Event } from "../../types/index.ts";
import { calculateBudgetTotals, formatMoney, toDecimal } from "../../utils/money.ts";

interface BudgetViewProps {
  items: BudgetItem[];
  event: Event;
  onAddItem: (item: Partial<BudgetItem>) => void;
  onUpdateItem: (id: string, updates: Partial<BudgetItem>) => void;
  onDeleteItem: (id: string) => void;
  onOpenAskFestiya: (prompt?: string) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  items,
  event,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onOpenAskFestiya,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // New item form state
  const [newItemCategory, setNewItemCategory] = useState("Venue & Space");
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemEstimate, setNewItemEstimate] = useState("");
  const [newItemQuoted, setNewItemQuoted] = useState("");
  const [newItemCommitted, setNewItemCommitted] = useState("");
  const [newItemActual, setNewItemActual] = useState("");

  const totals = calculateBudgetTotals(event.targetBudget, event.currency, items);
  const targetNum = toDecimal(totals.target);
  const estimatedNum = toDecimal(totals.estimated);
  const committedNum = toDecimal(totals.committed);
  const actualNum = toDecimal(totals.actual);
  const remainingNum = toDecimal(totals.remaining);

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const filteredItems = selectedCategory === "all" ? items : items.filter((i) => i.category === selectedCategory);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem({
      category: newItemCategory,
      label: newItemLabel || "Expense Item",
      likelyEstimate: newItemEstimate ? Number(newItemEstimate) : undefined,
      quotedAmount: newItemQuoted ? Number(newItemQuoted) : undefined,
      committedAmount: newItemCommitted ? Number(newItemCommitted) : undefined,
      actualAmount: newItemActual ? Number(newItemActual) : undefined,
      currency: event.currency,
      status: newItemActual ? "paid" : newItemCommitted ? "committed" : newItemQuoted ? "quoted" : "estimated",
      isEstimate: !newItemCommitted && !newItemActual,
    });
    setNewItemLabel("");
    setNewItemEstimate("");
    setNewItemQuoted("");
    setNewItemCommitted("");
    setNewItemActual("");
    setShowAddModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. High-Level Financial Health Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Target */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Target Budget
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px", color: "var(--ink)" }}>
            {formatMoney(targetNum, event.currency)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--ink-secondary)", marginTop: "4px" }}>
            Stated ceiling
          </div>
        </div>

        {/* Estimated Total */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Total Estimated
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px", color: "var(--cobalt)" }}>
            {formatMoney(estimatedNum, event.currency)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--ink-secondary)", marginTop: "4px" }}>
            {targetNum > 0 ? `${Math.round((estimatedNum / targetNum) * 100)}% of target` : "Based on quotes"}
          </div>
        </div>

        {/* Committed */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Committed / Contracted
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px", color: "#B38600" }}>
            {formatMoney(committedNum, event.currency)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--ink-secondary)", marginTop: "4px" }}>
            Legally bound
          </div>
        </div>

        {/* Actual Paid */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Actual Spent
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "6px", color: "var(--mint)" }}>
            {formatMoney(actualNum, event.currency)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--ink-secondary)", marginTop: "4px" }}>
            Disbursed deposits
          </div>
        </div>

        {/* Remaining */}
        <div
          className="card"
          style={{
            padding: "20px",
            borderLeft: totals.status === "exceeded" ? "4px solid #E03131" : "4px solid var(--mint)",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Remaining Buffer
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              marginTop: "6px",
              color: totals.status === "exceeded" ? "#E03131" : "var(--ink)",
            }}
          >
            {formatMoney(remainingNum, event.currency)}
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: totals.status === "exceeded" ? "#E03131" : "var(--mint)",
              marginTop: "4px",
            }}
          >
            {totals.status === "exceeded"
              ? "⚠️ Over target budget"
              : totals.status === "warning"
              ? "⚡ Estimate exceeds target"
              : "✓ Health on track"}
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`btn btn-sm ${selectedCategory === "all" ? "btn-secondary" : ""}`}
            style={{ fontWeight: 600 }}
          >
            All Categories ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? "btn-secondary" : ""}`}
              style={{ fontWeight: 600 }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action CTAs */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onOpenAskFestiya("Analyze budget variances and suggest cost reductions")}
            className="btn btn-secondary btn-sm"
          >
            Ask Festiya to optimize
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={15} />
            <span>Add expense line</span>
          </button>
        </div>
      </div>

      {/* 3. Detailed Line Items Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
            <thead>
              <tr style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--surface-border)" }}>
                <th style={{ padding: "14px 18px", fontWeight: 700 }}>Item & Category</th>
                <th style={{ padding: "14px 18px", fontWeight: 700 }}>Estimate (Likely)</th>
                <th style={{ padding: "14px 18px", fontWeight: 700 }}>Vendor Quote</th>
                <th style={{ padding: "14px 18px", fontWeight: 700 }}>Committed</th>
                <th style={{ padding: "14px 18px", fontWeight: 700 }}>Actual Paid</th>
                <th style={{ padding: "14px 18px", fontWeight: 700 }}>Status</th>
                <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const est = item.likelyEstimate || item.lowEstimate;
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid var(--surface-border)",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "var(--ink)" }}>{item.label}</div>
                      <div style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "2px" }}>
                        {item.category} {item.rationale ? `• ${item.rationale}` : ""}
                      </div>
                    </td>

                    <td style={{ padding: "14px 18px", color: "var(--cobalt)", fontWeight: 600 }}>
                      {est ? formatMoney(est, item.currency) : "—"}
                    </td>

                    <td style={{ padding: "14px 18px", fontWeight: 600 }}>
                      {item.quotedAmount ? formatMoney(item.quotedAmount, item.currency) : "—"}
                    </td>

                    <td style={{ padding: "14px 18px", fontWeight: 600 }}>
                      {item.committedAmount ? formatMoney(item.committedAmount, item.currency) : "—"}
                    </td>

                    <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--mint)" }}>
                      {item.actualAmount ? formatMoney(item.actualAmount, item.currency) : "—"}
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span
                        className={`badge ${
                          item.status === "paid"
                            ? "badge-mint"
                            : item.status === "committed"
                            ? "badge-sunshine"
                            : item.status === "quoted"
                            ? "badge-cobalt"
                            : "badge-neutral"
                        }`}
                        style={{ textTransform: "capitalize" }}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          onClick={() => {
                            const newPaid = prompt("Enter actual paid amount:", item.actualAmount?.toString() || "");
                            if (newPaid !== null) {
                              onUpdateItem(item.id, {
                                actualAmount: Number(newPaid) || 0,
                                status: Number(newPaid) > 0 ? "paid" : item.status,
                              });
                            }
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "4px 8px" }}
                          title="Record payment"
                        >
                          Record Paid
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          style={{ color: "var(--ink-muted)", padding: "4px" }}
                          aria-label="Delete item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h3 className="serif-heading" style={{ fontSize: "20px", marginBottom: "16px" }}>
              Add Budget Line Item
            </h3>
            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  placeholder="e.g. Catering, Floral, Venue"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Item Label</label>
                <input
                  className="form-input"
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                  placeholder="e.g. Wedding Cake & Dessert Bar"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Estimate ({event.currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newItemEstimate}
                    onChange={(e) => setNewItemEstimate(e.target.value)}
                    placeholder="e.g. 1500"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quote Received ({event.currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newItemQuoted}
                    onChange={(e) => setNewItemQuoted(e.target.value)}
                    placeholder="e.g. 1400"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Committed ({event.currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newItemCommitted}
                    onChange={(e) => setNewItemCommitted(e.target.value)}
                    placeholder="e.g. 1400"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Actual Paid ({event.currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newItemActual}
                    onChange={(e) => setNewItemActual(e.target.value)}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
