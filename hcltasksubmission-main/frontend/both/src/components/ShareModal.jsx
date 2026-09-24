import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Share2 } from 'lucide-react';

export function ShareModal({ isOpen, onClose, code, question }) {
  const [copiedVote, setCopiedVote] = useState(false);
  const [copiedResults, setCopiedResults] = useState(false);

  if (!isOpen) return null;

  const origin = window.location.origin;
  const voteUrl = `${origin}/poll/${code}`;
  const resultsUrl = `${origin}/poll/${code}/results`;

  const handleCopy = async (url, type) => {
    try {
      await navigator.clipboard.writeText(url);
      if (type === 'vote') {
        setCopiedVote(true);
        setTimeout(() => setCopiedVote(false), 2000);
      } else {
        setCopiedResults(true);
        setTimeout(() => setCopiedResults(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              padding: '0.65rem',
              borderRadius: '0.75rem',
              color: '#818cf8',
            }}
          >
            <Share2 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Share This Live Poll</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Anyone with the link can participate instantly</p>
          </div>
        </div>

        {question && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '0.5rem',
              border: '1px solid #334155',
              fontSize: '0.95rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              color: '#f8fafc',
            }}
          >
            "{question}"
          </div>
        )}

        {/* Audience Voting Link */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Audience Voting Link (No login required)</span>
            <span style={{ color: '#6366f1', fontWeight: 600 }}>Code: {code}</span>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={voteUrl}
              className="form-input"
              style={{ fontSize: '0.85rem', color: '#cbd5e1' }}
            />
            <button
              className={`btn ${copiedVote ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              onClick={() => handleCopy(voteUrl, 'vote')}
              style={{ minWidth: '95px' }}
            >
              {copiedVote ? (
                <>
                  <Check size={16} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Results Stream Link */}
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="form-label">Real-Time Results Stream (Presenter View)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={resultsUrl}
              className="form-input"
              style={{ fontSize: '0.85rem', color: '#cbd5e1' }}
            />
            <button
              className={`btn ${copiedResults ? 'btn-secondary' : 'btn-outline'} btn-sm`}
              onClick={() => handleCopy(resultsUrl, 'results')}
              style={{ minWidth: '95px' }}
            >
              {copiedResults ? (
                <>
                  <Check size={16} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <a
            href={voteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={15} /> Open Vote Page
          </a>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
