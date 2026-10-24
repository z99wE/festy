import React, { useState } from "react";
import { Sparkles, X, Lock, Mail, User, Building, ShieldCheck } from "lucide-react";
import { User as UserType } from "../../types/index.ts";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload = mode === "signup"
        ? { email, password, name, workspaceName }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("festiya_token", data.token);
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close authentication backdrop"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      className="modal-backdrop"
    >
      {/* Interactive modal container stops propagation via separate button/role */}
      <section
        className="modal-content"
        role="region"
        aria-label="Authentication dialog"
        style={{
          maxWidth: "460px",
          background: "var(--surface)",
          color: "var(--text)",
          border: "2px solid var(--surface-border-strong)",
          borderRadius: "4px",
          padding: "36px 32px",
          boxShadow: "8px 8px 0px #000000",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close authentication modal"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "var(--text-muted)",
            cursor: "pointer",
            background: "transparent",
            border: "none",
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "4px",
              background: "var(--neopop-mint)",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px",
            }}
          >
            <Sparkles size={22} color="#000000" />
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            {mode === "login" ? "WORKSPACE ACCESS" : "PROVISION NEW TENANT"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
            {mode === "login"
              ? "Authenticate to your isolated enterprise workspace & event pipelines."
              : "Launch your private, isolated event operations command center."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--canvas-subtle)",
            border: "1px solid var(--surface-border)",
            borderRadius: "4px",
            padding: "4px",
            marginBottom: "24px",
          }}
        >
          <button
            type="button"
            aria-label="Switch to sign in"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "2px",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: mode === "login" ? "#000000" : "var(--text-muted)",
              background: mode === "login" ? "var(--neopop-mint)" : "transparent",
              border: mode === "login" ? "1px solid #000000" : "none",
              boxShadow: mode === "login" ? "2px 2px 0px #000000" : "none",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            aria-label="Switch to sign up"
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "2px",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: mode === "signup" ? "#000000" : "var(--text-muted)",
              background: mode === "signup" ? "var(--neopop-mint)" : "transparent",
              border: mode === "signup" ? "1px solid #000000" : "none",
              boxShadow: mode === "signup" ? "2px 2px 0px #000000" : "none",
              cursor: "pointer",
            }}
          >
            New Tenant
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(255, 71, 87, 0.15)",
              border: "1px solid rgba(255, 71, 87, 0.3)",
              color: "#FF4757",
              borderRadius: "10px",
              fontSize: "12.5px",
              marginBottom: "18px",
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "signup" && (
            <>
              <div className="form-group">
                <label htmlFor="auth-name-input" className="form-label" style={{ color: "#CBD5E1" }}>
                  Your Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    color="#64748B"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    id="auth-name-input"
                    aria-label="Your Full Name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    style={{
                      paddingLeft: "36px",
                      background: "#181C28",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="auth-workspace-input" className="form-label" style={{ color: "#CBD5E1" }}>
                  Workspace / Brand Name
                </label>
                <div style={{ position: "relative" }}>
                  <Building
                    size={16}
                    color="#64748B"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    id="auth-workspace-input"
                    aria-label="Workspace or Brand Name"
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g. Maya Experiences Studio"
                    style={{
                      paddingLeft: "36px",
                      background: "#181C28",
                      color: "#FFFFFF",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    className="form-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="auth-email-input" className="form-label" style={{ color: "#CBD5E1" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                color="#64748B"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                id="auth-email-input"
                aria-label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name at company dot com"
                style={{
                  paddingLeft: "36px",
                  background: "#181C28",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="auth-password-input" className="form-label" style={{ color: "#CBD5E1" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                color="#64748B"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                id="auth-password-input"
                aria-label="Password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{
                  paddingLeft: "36px",
                  background: "#181C28",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                className="form-input"
              />
            </div>
          </div>

          {/* Cloudflare Isolation Security Note */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "2px",
              background: "rgba(0, 229, 153, 0.08)",
              border: "1px solid var(--neopop-mint)",
              color: "var(--neopop-mint)",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <ShieldCheck size={14} />
            <span>CLOUDFLARE NATIVE AUTH • ZERO CROSS-TENANT DATA LEAKAGE</span>
          </div>

          <button
            type="submit"
            aria-label="Submit authentication form"
            disabled={isLoading}
            className="btn-primary"
            style={{
              padding: "14px",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "13px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "AUTHENTICATING..." : mode === "login" ? "SIGN IN TO WORKSPACE" : "PROVISION PRIVATE TENANT"}
          </button>
        </form>
      </section>
    </div>
  );
};
