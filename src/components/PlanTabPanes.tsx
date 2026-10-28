import React from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import type { BudgetItem, TaskItem, VendorCategory } from '../data/planBuilderData';

export interface PlanTabPanesProps {
  activeTab: 'budget' | 'tasks' | 'vendors' | 'ideas' | 'risks';
  budgetCategories: BudgetItem[];
  budgetAmount: number;
  currency: string;
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  vendorCategories: VendorCategory[];
  ideas: Array<{ title: string; desc: string; impact: string }>;
  risks: Array<{ risk: string; mitigation: string }>;
}

const catSubheadStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
};

const criteriaListStyle: React.CSSProperties = {
  paddingLeft: '18px',
  margin: '6px 0 0',
  fontSize: '0.85rem',
};

const flexGapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
};

const safeguardBoxStyle: React.CSSProperties = {
  background: 'var(--bg-canvas)',
  padding: '10px',
  borderRadius: '8px',
  borderLeft: '3px solid #059669',
};

const BudgetRow: React.FC<{ cat: BudgetItem; amount: number; currency: string }> = ({ cat, amount, currency }) => {
  const targetVal = Math.round(amount * cat.percentage);
  const lowVal = Math.round(amount * cat.lowRatio);
  const highVal = Math.round(amount * cat.highRatio);

  return (
    <tr>
      <td>
        <strong>{cat.category}</strong>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.label}</div>
      </td>
      <td className="number-cell">{currency}{lowVal.toLocaleString()}</td>
      <td className="number-cell font-bold" style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
        {currency}{targetVal.toLocaleString()}
      </td>
      <td className="number-cell">{currency}{highVal.toLocaleString()}</td>
      <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{cat.vendorNotes}</td>
    </tr>
  );
};

const TaskRow: React.FC<{ task: TaskItem; onToggle: (id: string) => void }> = ({ task, onToggle }) => {
  const badgeClass = task.priority === 'critical' ? 'sunshine' : task.priority === 'high' ? 'sunset' : 'mint';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(task.id);
    }
  };

  return (
    <li
      className={'task-row ' + (task.completed ? 'completed' : '')}
      role="button"
      tabIndex={0}
      aria-pressed={task.completed}
      onClick={() => onToggle(task.id)}
      onKeyDown={handleKeyDown}
    >
      <input
        type="checkbox"
        id={'task-checkbox-' + task.id}
        aria-label={'Mark task "' + task.title + '" as complete'}
        checked={task.completed}
        onChange={() => {}}
        className="task-checkbox"
      />
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          <span>{task.offset}</span>
          <span style={{ margin: '0 6px' }}>•</span>
          <span className={'badge-pill ' + badgeClass} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
            {task.priority}
          </span>
        </div>
      </div>
    </li>
  );
};

const VendorCard: React.FC<{ vc: VendorCategory }> = ({ vc }) => {
  return (
    <div className="vendor-card">
      <h4>{vc.category}</h4>
      <div style={{ marginBottom: '12px' }}>
        <span style={catSubheadStyle}>Must-Have Criteria:</span>
        <ul style={criteriaListStyle}>
          {vc.criteria.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <span style={catSubheadStyle}>Negotiation Questions:</span>
        <ul style={criteriaListStyle}>
          {vc.questions.map((q, i) => (
            <li key={i} style={{ fontStyle: 'italic' }}>
              "{q}"
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const IdeaCard: React.FC<{ idea: { title: string; desc: string; impact: string } }> = ({ idea }) => {
  return (
    <div className="idea-card">
      <div style={flexGapStyle}>
        <Lightbulb size={16} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
        <h4 style={{ margin: 0 }}>{idea.title}</h4>
      </div>
      <p style={{ fontSize: '0.88rem', margin: '0 0 10px' }}>{idea.desc}</p>
      <span className="badge-pill mint" style={{ fontSize: '0.74rem' }}>
        {idea.impact}
      </span>
    </div>
  );
};

const RiskCard: React.FC<{ item: { risk: string; mitigation: string } }> = ({ item }) => {
  return (
    <div className="risk-card">
      <div style={flexGapStyle}>
        <AlertTriangle size={16} style={{ color: '#D97706' }} />
        <h4 style={{ margin: 0 }}>Potential Risk</h4>
      </div>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
        {item.risk}
      </p>
      <div style={safeguardBoxStyle}>
        <strong style={{ fontSize: '0.8rem', color: '#059669' }}>Safeguard: </strong>
        <span style={{ fontSize: '0.85rem' }}>{item.mitigation}</span>
      </div>
    </div>
  );
};

/**
 * PlanTabPanes renders budget tables, task checklists, vendor negotiation guides, ideas, and risk matrices.
 */
export const PlanTabPanes: React.FC<PlanTabPanesProps> = ({
  activeTab,
  budgetCategories,
  budgetAmount,
  currency,
  tasks,
  onToggleTask,
  vendorCategories,
  ideas,
  risks,
}) => {
  if (activeTab === 'budget') {
    return (
      <div className="tab-pane active" aria-labelledby="tab-budget">
        <table className="budget-table">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Conservative</th>
              <th scope="col">Target</th>
              <th scope="col">Luxury</th>
              <th scope="col">Vendor Tip</th>
            </tr>
          </thead>
          <tbody>
            {budgetCategories.map((cat) => (
              <BudgetRow key={cat.id} cat={cat} amount={budgetAmount} currency={currency} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'tasks') {
    return (
      <div className="tab-pane active" aria-labelledby="tab-tasks">
        <ul className="tasks-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={onToggleTask} />
          ))}
        </ul>
      </div>
    );
  }

  if (activeTab === 'vendors') {
    return (
      <div className="tab-pane active" aria-labelledby="tab-vendors">
        <div className="vendor-matrix-grid">
          {vendorCategories.map((vc, idx) => (
            <VendorCard key={idx} vc={vc} />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'ideas') {
    return (
      <div className="tab-pane active" aria-labelledby="tab-ideas">
        <div className="ideas-grid">
          {ideas.map((idea, idx) => (
            <IdeaCard key={idx} idea={idea} />
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'risks') {
    return (
      <div className="tab-pane active" aria-labelledby="tab-risks">
        <div className="risks-grid">
          {risks.map((item, idx) => (
            <RiskCard key={idx} item={item} />
          ))}
        </div>
      </div>
    );
  }

  return null;
};
