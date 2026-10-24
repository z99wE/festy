-- Festiya Relational Schema for Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  locale TEXT NOT NULL DEFAULT 'en-US',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('personal', 'professional')),
  owner_id TEXT NOT NULL,
  brand_name TEXT,
  brand_logo TEXT,
  brand_color TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro', 'agency')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workspace_members (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'planner', 'client', 'viewer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wedding', 'birthday', 'gathering', 'work_event', 'custom')),
  date_mode TEXT NOT NULL DEFAULT 'decided' CHECK (date_mode IN ('decided', 'undecided')),
  start_date TEXT,
  end_date TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  location_mode TEXT NOT NULL DEFAULT 'in_person' CHECK (location_mode IN ('in_person', 'virtual', 'hybrid')),
  location_address TEXT,
  guest_count INTEGER,
  currency TEXT NOT NULL DEFAULT 'USD',
  target_budget REAL,
  style TEXT,
  constraints TEXT,
  created_by TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('draft', 'planning', 'confirmed', 'completed', 'archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_events_workspace ON events(workspace_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

CREATE TABLE IF NOT EXISTS event_members (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'planner', 'client', 'viewer')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  schema_version TEXT NOT NULL DEFAULT '1',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  summary TEXT NOT NULL,
  assumptions_json TEXT NOT NULL DEFAULT '[]',
  open_questions_json TEXT NOT NULL DEFAULT '[]',
  content_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_plans_event ON plans(event_id, version);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'blocked')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  owner_id TEXT,
  owner_name TEXT,
  due_date TEXT,
  due_offset_days INTEGER,
  depends_on_json TEXT NOT NULL DEFAULT '[]',
  linked_vendor_id TEXT,
  linked_budget_item_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_event_status ON tasks(event_id, status);

CREATE TABLE IF NOT EXISTS budget_items (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  category TEXT NOT NULL,
  label TEXT NOT NULL,
  low_estimate REAL,
  likely_estimate REAL,
  high_estimate REAL,
  quoted_amount REAL,
  committed_amount REAL,
  actual_amount REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'estimated' CHECK (status IN ('estimated', 'quoted', 'committed', 'paid')),
  linked_vendor_id TEXT,
  rationale TEXT,
  is_estimate INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_budget_items_event ON budget_items(event_id);

CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  notes TEXT,
  quote_amount REAL,
  quote_currency TEXT,
  status TEXT NOT NULL DEFAULT 'to_research' CHECK (status IN ('to_research', 'contacted', 'quote_received', 'shortlisted', 'selected', 'not_proceeding')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vendors_event ON vendors(event_id);

CREATE TABLE IF NOT EXISTS ideas (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  cost_impact TEXT NOT NULL DEFAULT 'unknown' CHECK (cost_impact IN ('low', 'medium', 'high', 'unknown')),
  is_accepted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  risk TEXT NOT NULL,
  mitigation TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  is_resolved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS run_of_show (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  time_label TEXT NOT NULL,
  activity TEXT NOT NULL,
  owner_name TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shares (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  share_token TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'client')),
  allowed_sections_json TEXT NOT NULL DEFAULT '["summary","budget","timeline","vendors","ideas","runOfShow"]',
  expires_at TEXT,
  is_revoked INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_shares_token ON shares(share_token);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'plus', 'pro', 'agency')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled')),
  current_period_end TEXT NOT NULL,
  payment_provider TEXT NOT NULL DEFAULT 'stripe',
  external_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usage_ledger (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  feature TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  provider_model TEXT,
  estimated_cost REAL DEFAULT 0,
  request_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  event_id TEXT,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);
