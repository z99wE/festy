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
          background: "#141721",
          color: "#FFFFFF",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "24px",
          padding: "32px 28px",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close authentication modal"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "#94A3B8",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #FF4757 0%, #A855F7 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px",
              boxShadow: "0 6px 16px rgba(255, 71, 87, 0.35)",
            }}
          >
            <Sparkles size={24} color="#FFFFFF" />
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            {mode === "login" ? "Welcome back to Festiya" : "Create your Festiya account"}
          </h2>
          <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>
            {mode === "login"
              ? "Sign in to access your isolated workspace & events."
              : "Launch your private, multi-tenant event command center."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "#1C2030",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "20px",
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
              padding: "8px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              color: mode === "login" ? "#FFFFFF" : "#94A3B8",
              background: mode === "login" ? "#FF4757" : "transparent",
              transition: "all 0.15s ease",
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
              padding: "8px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              color: mode === "signup" ? "#FFFFFF" : "#94A3B8",
              background: mode === "signup" ? "#FF4757" : "transparent",
              transition: "all 0.15s ease",
            }}
          >
            Create Account
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
              padding: "8px 12px",
              borderRadius: "8px",
              background: "rgba(46, 213, 115, 0.1)",
              border: "1px solid rgba(46, 213, 115, 0.25)",
              color: "#2ED573",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={14} />
            <span>Cloudflare Native Auth • Strict Tenant Isolation • Zero Data Leakage</span>
          </div>

          <button
            type="submit"
            aria-label="Submit authentication form"
            disabled={isLoading}
            className="btn-skeuo"
            style={{
              padding: "12px",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "14px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Authenticating..." : mode === "login" ? "Sign In to Workspace" : "Create Private Tenant"}
          </button>
        </form>
      </section>
    </div>
  );
};
