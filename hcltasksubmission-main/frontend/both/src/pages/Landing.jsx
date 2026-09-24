import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Zap, ShieldCheck, Users, Radio, Sparkles } from 'lucide-react';

export function Landing() {
  const [pollCode, setPollCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinPoll = (e) => {
    e.preventDefault();
    const clean = pollCode.trim();
    if (!clean) {
      setError('Please enter a valid poll code');
      return;
    }
    navigate(`/poll/${clean}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          maxWidth: '850px',
          margin: '2rem auto 0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <Sparkles size={15} />
          <span>Real-Time Audience Polling Powered by Go & Redis</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}
        >
          Create Live Polls.{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Watch Votes Stream In Real-Time.
          </span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '650px', lineHeight: 1.6 }}>
          Zero page refreshes. When audience members cast their vote, everyone sees the results animate instantly through Redis Pub/Sub and Go WebSockets.
        </p>

        {/* Join Poll Form */}
        <div
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
            marginTop: '0.5rem',
          }}
        >
          <form onSubmit={handleJoinPoll} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter Poll Code (e.g. abc123)"
              value={pollCode}
              onChange={(e) => {
                setPollCode(e.target.value);
                setError('');
              }}
              className="form-input"
              style={{ flex: 1, minWidth: '220px' }}
            />
            <button type="submit" className="btn btn-primary">
              <span>Join Poll</span>
              <ArrowRight size={16} />
            </button>
          </form>
          {error && <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'left' }}>{error}</div>}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create Your First Poll
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In to Dashboard
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '1rem',
        }}
      >
        <div className="card">
          <div
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <Radio size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Redis Pub/Sub Realtime</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Every vote is published to a dedicated Redis channel and pushed through Go WebSockets to all connected viewers in milliseconds.
          </p>
        </div>

        <div className="card">
          <div
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <BarChart3 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Live Animated Bars</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Fluid CSS spring animations dynamically shift percentages, highlight current leading options, and celebrate votes with confetti.
          </p>
        </div>

        <div className="card">
          <div
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.2)',
              color: '#fb7185',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Full Security & Validation</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Bcrypt password hashing, JWT authorization, atomic MongoDB updates, and strict server-side validation protect your polls.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Landing;
