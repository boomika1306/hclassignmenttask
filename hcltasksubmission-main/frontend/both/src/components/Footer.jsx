import React from 'react';
import { Layers, Activity, Zap, Database } from 'lucide-react';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #334155',
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '2rem 1.25rem',
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: '#94a3b8',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem', marginBottom: '0.25rem' }}>
            LivePoll – Interactive Polling Platform
          </div>
          <div>Engineered with Go (Gin), Redis Pub/Sub, MongoDB, WebSockets & React</div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '0.3rem 0.65rem',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#38bdf8',
            }}
          >
            <Zap size={13} /> Go Gin
          </span>
          <span
            style={{
              padding: '0.3rem 0.65rem',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#f43f5e',
            }}
          >
            <Activity size={13} /> Redis Pub/Sub
          </span>
          <span
            style={{
              padding: '0.3rem 0.65rem',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#10b981',
            }}
          >
            <Database size={13} /> MongoDB
          </span>
          <span
            style={{
              padding: '0.3rem 0.65rem',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#a855f7',
            }}
          >
            <Layers size={13} /> WebSockets
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
