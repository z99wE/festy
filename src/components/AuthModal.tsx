import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Building, ShieldCheck, ArrowRight, LogIn, CheckCircle } from 'lucide-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  workspaceName: string;
  token: string;
  createdAt: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'signup';
}

function createAuthUser(mode: 'login' | 'signup', name: string, email: string, workspaceName: string): AuthUser {
  const defaultWs = (name.trim() || 'Festiya') + ' Workspace';
  return {
    id: `usr_${Date.now()}`,
    name: mode === 'signup' ? name.trim() : (email.split('@')[0] || 'Celebration Host'),
    email: email.trim().toLowerCase(),
    workspaceName: workspaceName.trim() || defaultWs,
    token: `cf_tok_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}

function createDemoUser(): AuthUser {
  return {
    id: 'usr_demo_host',
    name: 'Alex Rivera',
    email: ['alex', 'festiya.demo'].join('@'),
    workspaceName: 'Rivera Celebrations & Studio',
    token: `cf_tok_demo_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}

function safePersistUser(user: AuthUser): void {
  try {
    localStorage.setItem('festiya_auth_user', JSON.stringify(user));
  } catch (err) {
    console.warn('Could not persist auth to localStorage', err);
  }
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Simulate Edge Auth authentication & tenant token generation
    setTimeout(() => {
      const user = createAuthUser(mode, name, email, workspaceName);
      safePersistUser(user);

      setLoading(false);
      setSuccessMsg(mode === 'signup' ? 'Account created successfully! Welcome to Festiya.' : 'Welcome back to your workspace!');

      setTimeout(() => {
        onAuthSuccess(user);
        onClose();
      }, 700);
    }, 600);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const demoUser = createDemoUser();
      safePersistUser(demoUser);
      setLoading(false);
      onAuthSuccess(demoUser);
      onClose();
    }, 400);
  };

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="auth-modal-card">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close authentication modal"
          className="auth-modal-close-btn"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="auth-modal-header">
          <div className="auth-logo-badge">
            <img
              src="/festiya-logo-nav.webp"
              alt="Festiya - Autonomous Celebration Architect Brand Emblem"
              title="Festiya Account Workspace"
              width={96}
              height={36}
              style={{ height: '36px', width: 'auto' }}
            />
          </div>
          <h2 id="auth-modal-title" className="auth-title">
            {mode === 'signup' ? 'Create Your Festiya Account' : 'Sign In to Workspace'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'signup'
              ? 'Join thousands of celebration hosts, planners, and families'
              : 'Access your saved event plans, budgets, and vendor checklists'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-switch" role="tablist">
          <button aria-label="Create Account tab"
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
          >
            Create Account
          </button>
          <button aria-label="Sign In tab"
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
          >
            Sign In
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="auth-alert error">
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <>
              <div className="auth-form-group">
                <label htmlFor="auth-name" className="auth-form-label">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="auth-name"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="auth-workspace" className="auth-form-label">
                  Workspace or Family Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <div className="auth-input-wrapper">
                  <Building size={16} className="auth-input-icon" />
                  <input
                    id="auth-workspace"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Chen Family Events or Maya Studio"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label htmlFor="auth-email" className="auth-form-label">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="auth-email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="auth-password" className="auth-form-label">
              Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="auth-password"
                type="password"
                className="auth-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Edge Security Badge */}
          <div className="auth-security-badge">
            <ShieldCheck size={15} color="#059669" />
            <span>Edge Tenant Isolation • Zero Data Leakage</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            aria-label={mode === 'signup' ? 'Create Workspace' : 'Sign In to Festiya'}
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'signup' ? (
              <>
                <span>Create Workspace</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Sign In to Festiya</span>
                <LogIn size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Option */}
        <div className="auth-demo-divider">
          <span>or test immediately</span>
        </div>

        <button
          type="button"
          aria-label="Instant 1-Click Demo Login as Alex Rivera"
          className="auth-demo-btn"
          onClick={handleDemoLogin}
          disabled={loading}
        >
          Instant 1-Click Demo Login (Alex Rivera)
        </button>
      </div>
    </div>
  );
};
