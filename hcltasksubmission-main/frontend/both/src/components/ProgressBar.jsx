import React from 'react';
import { Trophy, CheckCircle } from 'lucide-react';

export function ProgressBar({ option, totalVotes = 0, isLeader = false, isUserChoice = false }) {
  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

  return (
    <div className="poll-option-result">
      <div className="option-meta">
        <span className="option-text-label">
          {isLeader && totalVotes > 0 && (
            <Trophy size={16} style={{ color: '#fbbf24' }} title="Current Leader" />
          )}
          {option.text}
          {isUserChoice && (
            <span
              style={{
                fontSize: '0.75rem',
                background: 'rgba(99, 102, 241, 0.25)',
                color: '#a5b4fc',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <CheckCircle size={10} /> Your Vote
            </span>
          )}
        </span>

        <div className="option-stat-badge">
          <span>{percentage}%</span>
          <span className="votes-count">({option.votes} {option.votes === 1 ? 'vote' : 'votes'})</span>
        </div>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${isLeader && totalVotes > 0 ? 'winner' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
