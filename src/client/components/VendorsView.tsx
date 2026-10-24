import React, { useState } from "react";
import { Plus, Phone, Mail, Globe, CheckCircle2, Trash2, Tag, Building } from "lucide-react";
import { Vendor, VendorStatus, Event } from "../../types/index.ts";
import { formatMoney } from "../../utils/money.ts";

interface VendorsViewProps {
  vendors: Vendor[];
  event: Event;
  onAddVendor: (vendor: Partial<Vendor>) => void;
  onUpdateVendor: (id: string, updates: Partial<Vendor>) => void;
  onDeleteVendor: (id: string) => void;
  onOpenAskFestiya: (prompt?: string) => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({
  vendors,
  event,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor,
  onOpenAskFestiya,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Venue");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [newStatus, setNewStatus] = useState<VendorStatus>("to_research");

  const statusBadges: Record<VendorStatus, { class: string; label: string }> = {
    to_research: { class: "badge-neutral", label: "To Research" },
    contacted: { class: "badge-cobalt", label: "Contacted" },
    quote_received: { class: "badge-sunshine", label: "Quote Received" },
    shortlisted: { class: "badge-berry", label: "Shortlisted" },
    selected: { class: "badge-mint", label: "Selected Partner" },
    not_proceeding: { class: "badge-neutral", label: "Not Proceeding" },
  };

  const filteredVendors = vendors.filter((v) => {
    if (filterStatus === "all") return true;
    return v.status === filterStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVendor({
      name: newName || "Vendor Partner",
      category: newCategory,
      contactName: newContactName || undefined,
      contactEmail: newContactEmail || undefined,
      contactPhone: newContactPhone || undefined,
      notes: newNotes || undefined,
      quoteAmount: newQuote ? Number(newQuote) : undefined,
      quoteCurrency: event.currency,
      status: newStatus,
    });
    setNewName("");
    setNewContactName("");
    setNewContactEmail("");
    setNewContactPhone("");
    setNewNotes("");
    setNewQuote("");
    setNewStatus("to_research");
    setShowAddModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner & Actions */}
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Partner & Vendor Operations</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-secondary)", marginTop: "2px" }}>
              Track prospective categories, quotes received, and confirmed contracts in one pipeline.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onOpenAskFestiya("Suggest key questions to ask prospective venue and catering vendors")}
              className="btn btn-secondary btn-sm"
            >
              Draft questions to ask
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} />
              <span>Add vendor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["all", "selected", "quote_received", "contacted", "to_research"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`btn btn-sm ${filterStatus === st ? "btn-secondary" : ""}`}
            style={{ fontWeight: 600, textTransform: "capitalize" }}
          >
            {st.replace("_", " ")} ({st === "all" ? vendors.length : vendors.filter((v) => v.status === st).length})
          </button>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {filteredVendors.map((vendor) => {
          const sBadge = statusBadges[vendor.status] || statusBadges.to_research;
          return (
            <div
              key={vendor.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderTop: vendor.status === "selected" ? "4px solid var(--mint)" : "1px solid var(--surface-border)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <span className="badge badge-neutral" style={{ marginBottom: "6px" }}>
                      <Tag size={11} />
                      <span>{vendor.category}</span>
                    </span>
                    <h4 style={{ fontSize: "17px", fontWeight: 700, color: "var(--ink)" }}>{vendor.name}</h4>
                  </div>
                  <span className={`badge ${sBadge.class}`}>{sBadge.label}</span>
                </div>

                {/* Quote amount */}
                {vendor.quoteAmount ? (
                  <div style={{ padding: "8px 12px", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "var(--ink-secondary)", fontWeight: 600 }}>Quote Amount:</span>
                    <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--ink)" }}>
                      {formatMoney(vendor.quoteAmount, vendor.quoteCurrency || event.currency)}
                    </span>
                  </div>
                ) : null}

                {/* Contact info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px", color: "var(--ink-secondary)", marginBottom: "12px" }}>
                  {vendor.contactName && <div>👤 {vendor.contactName}</div>}
                  {vendor.contactEmail && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Mail size={13} />
                      <a href={`mailto:${vendor.contactEmail}`} style={{ color: "var(--cobalt)" }}>
                        {vendor.contactEmail}
                      </a>
                    </div>
                  )}
                  {vendor.contactPhone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={13} />
                      <span>{vendor.contactPhone}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {vendor.notes && (
                  <p style={{ fontSize: "12.5px", color: "var(--ink-secondary)", background: "#FFFDF9", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--surface-border)", lineHeight: 1.45 }}>
                    {vendor.notes}
                  </p>
                )}
              </div>

              {/* Status Selector & Delete */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--surface-border)",
                }}
              >
                <select
                  value={vendor.status}
                  onChange={(e) => onUpdateVendor(vendor.id, { status: e.target.value as VendorStatus })}
                  className="form-select"
                  style={{ width: "auto", fontSize: "12px", padding: "4px 8px" }}
                >
                  <option value="to_research">To Research</option>
                  <option value="contacted">Contacted</option>
                  <option value="quote_received">Quote Received</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="selected">Selected</option>
                  <option value="not_proceeding">Not Proceeding</option>
                </select>

                <button
                  onClick={() => onDeleteVendor(vendor.id)}
                  style={{ color: "var(--ink-muted)", padding: "4px" }}
                  aria-label="Delete vendor"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <h3 className="serif-heading" style={{ fontSize: "20px", marginBottom: "16px" }}>
              Add Vendor / Partner
            </h3>
            <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label">Vendor Business Name</label>
                <input
                  className="form-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Blue Hill Farm Banquets"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    className="form-input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Venue, Catering, Photography"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pipeline Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as VendorStatus)}
                  >
                    <option value="to_research">To Research</option>
                    <option value="contacted">Contacted</option>
                    <option value="quote_received">Quote Received</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="selected">Selected</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    className="form-input"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quote Amount ({event.currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="e.g. 4500"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="events@example.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Criteria</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Deposit requirements, tasting notes, load-in constraints"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
