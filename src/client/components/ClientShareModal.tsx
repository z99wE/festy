import React, { useState } from "react";
import { X, Share2, Copy, Check, Eye, Lock, ShieldCheck } from "lucide-react";
import { Share, Event } from "../../types/index.ts";

interface ClientShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  share: Share | null;
  onCreateShare: (sections: string[]) => void;
  onRevokeShare: (shareId: string) => void;
  onOpenPreview: (token: string) => void;
}

export const ClientShareModal: React.FC<ClientShareModalProps> = ({
  isOpen,
  onClose,
  event,
  share,
  onCreateShare,
  onRevokeShare,
  onOpenPreview,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>(
    share?.allowedSections || ["summary", "budget", "timeline", "vendors", "ideas", "runOfShow"]
  );

  const availableSections = [
    { key: "summary", label: "Executive Concept & Summary" },
    { key: "budget", label: "Budget Allocations (Quotes & Estimates)" },
    { key: "timeline", label: "Milestone Timeline & Checklists" },
    { key: "vendors", label: "Partner & Vendor Directory" },
    { key: "ideas", label: "Curated Experience Ideas" },
    { key: "runOfShow", label: "Day-of Run of Show Schedule" },
  ];

  const toggleSection = (key: string) => {
    if (selectedSections.includes(key)) {
      setSelectedSections(selectedSections.filter((s) => s !== key));
    } else {
      setSelectedSections([...selectedSections, key]);
    }
  };

  const shareUrl = share
    ? `${window.location.origin}?share=${share.shareToken}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div>
            <div className="badge badge-cobalt" style={{ marginBottom: "6px" }}>
              <ShieldCheck size={13} />
              <span>Client Share Portal</span>
            </div>
            <h2 className="serif-heading" style={{ fontSize: "22px" }}>
              Share read-only plan
            </h2>
            <p style={{ fontSize: "13px", color: "var(--ink-secondary)" }}>
              Generate a secure, revocable client link with granular section permissions.
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-muted)", cursor: "pointer" }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Section permissions checklist */}
        <div style={{ marginBottom: "20px" }}>
          <label className="form-label" style={{ marginBottom: "8px", display: "block" }}>
            Select sections visible to client:
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {availableSections.map((sec) => (
              <label
                key={sec.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  padding: "8px 12px",
                  background: "var(--surface-alt)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSections.includes(sec.key)}
                  onChange={() => toggleSection(sec.key)}
                />
                <span style={{ fontWeight: 600 }}>{sec.label}</span>
              </label>
            ))}
          </div>
        </div>

        {share && !share.isRevoked ? (
          <div>
            <label className="form-label" style={{ marginBottom: "6px", display: "block" }}>
              Active Share Link (Views: {share.viewCount})
            </label>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input
                className="form-input"
                readOnly
                value={shareUrl}
                style={{ fontSize: "12px", background: "var(--surface-alt)" }}
              />
              <button onClick={handleCopy} className="btn btn-secondary btn-sm" style={{ padding: "8px 14px" }}>
                {copied ? <Check size={16} color="var(--mint)" /> : <Copy size={16} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => onOpenPreview(share.shareToken)}
                className="btn btn-secondary btn-sm"
              >
                <Eye size={15} />
                <span>Preview client view</span>
              </button>
              <button
                onClick={() => onRevokeShare(share.id)}
                style={{ color: "#E03131", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}
              >
                Revoke link access
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: "10px" }}>
            <button
              onClick={() => onCreateShare(selectedSections)}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              <Share2 size={16} />
              <span>Generate secure client link</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
