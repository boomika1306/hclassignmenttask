import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div style={{ maxWidth: '480px', margin: '5rem auto', textAlign: 'center' }}>
      <div className="card">
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <HelpCircle size={36} />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f87171', lineHeight: 1 }}>404</h1>
        <h2 className="card-title" style={{ marginTop: '0.5rem' }}>Page Not Found</h2>
        <p className="card-subtitle" style={{ marginTop: '0.5rem', marginBottom: '1.75rem' }}>
          The link or poll you are looking for does not exist, has been removed, or has an invalid code.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Go to Home</span>
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
