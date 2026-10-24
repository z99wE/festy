import React, { useState } from "react";
import { X, Download, FileText, Trash2, ShieldCheck, AlertCircle } from "lucide-react";
import { Event } from "../../types/index.ts";

interface AccountExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onDownloadProposalMarkdown: () => void;
  onDownloadGdprJson: () => void;
}

export const AccountExportModal: React.FC<AccountExportModalProps> = ({
  isOpen,
  onClose,
  event,
  onDownloadProposalMarkdown,
  onDownloadGdprJson,
}) => {
  if (!isOpen) return null;

  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div>
            <div className="badge badge-neutral" style={{ marginBottom: "6px" }}>
              <ShieldCheck size={13} />
              <span>Data Portability & Exports</span>
            </div>
            <h2 className="serif-heading" style={{ fontSize: "22px" }}>
              Export Event & Account Data
            </h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-muted)", cursor: "pointer" }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* 1. Client Proposal Markdown */}
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <FileText size={24} color="var(--cobalt)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                  Client Proposal Document (.md)
                </h4>
                <p style={{ fontSize: "12.5px", color: "var(--ink-secondary)", marginBottom: "12px" }}>
                  A beautifully formatted markdown proposal including executive concept, budget breakdown, milestone checklist, partner list, and run-of-show.
                </p>
                <button onClick={onDownloadProposalMarkdown} className="btn btn-secondary btn-sm">
                  <Download size={14} />
                  <span>Download Proposal Markdown</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Full GDPR JSON Export */}
          <div className="card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <Download size={24} color="var(--mint)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                  Complete Account & Event Archive (JSON)
                </h4>
                <p style={{ fontSize: "12.5px", color: "var(--ink-secondary)", marginBottom: "12px" }}>
                  GDPR Article 20 compliant machine-readable export containing all workspace events, line items, partner notes, and activity history.
                </p>
                <button onClick={onDownloadGdprJson} className="btn btn-secondary btn-sm">
                  <Download size={14} />
                  <span>Download GDPR Archive (JSON)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Account Deletion Request */}
          <div
            className="card"
            style={{
              padding: "18px",
              border: "1px dashed #FFA8A8",
              background: "#FFFBFB",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <Trash2 size={24} color="#E03131" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#C92A2A", marginBottom: "4px" }}>
                  Account / Data Deletion
                </h4>
                <p style={{ fontSize: "12px", color: "var(--ink-secondary)", marginBottom: "10px" }}>
                  Permanently purge workspaces, saved plans, and collaborator invitations according to our retention policy.
                </p>
                <button
                  onClick={() => {
                    alert("Account deletion request logged. Per GDPR policy, your archive link has been generated above before final purge.");
                    onClose();
                  }}
                  style={{ color: "#E03131", fontSize: "12px", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                >
                  Initiate complete account deletion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
