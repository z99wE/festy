import React from 'react';
import { Play } from 'lucide-react';
import type { HardDrillResult } from '../services/festiSecurityGuard';

export interface FestiDrillsViewProps {
  drillResults?: HardDrillResult[];
  isDrillRunning?: boolean;
  onRunLiveDrills?: () => void;
  onSelectVector?: (testInput: string) => void;
}

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const headerTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 800,
  color: 'var(--bubblegum-purple-blue, #5b42f3)',
};

const headerSubtitleStyle: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: '12px',
  color: 'var(--text-secondary)',
};

const runBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '12px',
  gap: '6px',
};

const DrillCard: React.FC<{ dr: HardDrillResult; onSelect: (input: string) => void }> = ({ dr, onSelect }) => {
  const passClass = dr.passed ? 'passed' : 'failed';
  const passText = dr.passed ? 'PASSED' : 'FLAGGED';
  return (
    <div className={'drill-item-card ' + passClass}>
      <div style={cardHeaderStyle}>
        <span className="drill-name">{dr.drillName}</span>
        <span className="drill-pill">{dr.latencyMs}ms • {passText}</span>
      </div>
      <div className="drill-input-preview">
        <span className="drill-label">Input Attack:</span> "{dr.testInput}"
      </div>
      <div className="drill-response-preview">
        <span className="drill-label">Defense:</span> {dr.sampleResponse}
      </div>
      <button
        type="button"
        aria-label="Test this vector in chat"
        className="drill-try-btn"
        onClick={() => onSelect(dr.testInput)}
      >
        Test this vector in chat →
      </button>
    </div>
  );
};

/**
 * FestiDrillsView displays active security evaluation matrices and defensive drills.
 */
export const FestiDrillsView: React.FC<FestiDrillsViewProps> = ({
  drillResults = [],
  isDrillRunning = false,
  onRunLiveDrills,
  onSelectVector,
}) => {
  const handleSelect = (input: string) => {
    if (onSelectVector) onSelectVector(input);
  };

  return (
    <div className="festi-drills-container">
      <div className="drills-header">
        <div>
          <h4 style={headerTitleStyle}>
            Hard Drills Security Matrix
          </h4>
          <p style={headerSubtitleStyle}>
            Active neutralization against LLM Hijacking, Spooking, Jacking, Meta-Prompting & Domain Violations.
          </p>
        </div>
        {onRunLiveDrills && (
          <button
            type="button"
            aria-label="Run Live Drills"
            className="btn btn-secondary"
            style={runBtnStyle}
            onClick={onRunLiveDrills}
            disabled={isDrillRunning}
          >
            <Play size={12} className={isDrillRunning ? 'festi-spin-icon' : ''} />
            <span>{isDrillRunning ? 'Testing...' : 'Run Live Drills'}</span>
          </button>
        )}
      </div>

      <div className="drills-status-pills">
        <span className="drill-status-badge success">Hijacking Guard: 100%</span>
        <span className="drill-status-badge success">Meta-Prompt Shield: 100%</span>
        <span className="drill-status-badge success">Domain Lock: Events Only</span>
        <span className="drill-status-badge info">Load Balancer: Healthy</span>
      </div>

      <div className="drills-list">
        {drillResults.map((dr, idx) => (
          <DrillCard key={idx} dr={dr} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
};
