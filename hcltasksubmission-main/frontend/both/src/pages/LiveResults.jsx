import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LivePollSocket } from '../services/websocket';
import api from '../services/api';
import LiveBadge from '../components/LiveBadge';
import ProgressBar from '../components/ProgressBar';
import ShareModal from '../components/ShareModal';
import { Share2, Vote, Maximize2, Minimize2, Users, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export function LiveResults() {
  const { code } = useParams();
  const [poll, setPoll] = useState(null);
  const [socketStatus, setSocketStatus] = useState('connecting');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [recentVotePulse, setRecentVotePulse] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);

  // 1. Initial fetch of poll
  useEffect(() => {
    let isMounted = true;

    async function loadInitial() {
      try {
        const data = await api.getPollByCode(code);
        if (isMounted) {
          setPoll(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Poll not found');
          setLoading(false);
        }
      }
    }
    loadInitial();

    // 2. Establish live WebSocket connection
    const liveSocket = new LivePollSocket(code, {
      onStatusChange: (status) => {
        if (isMounted) setSocketStatus(status);
      },
      onMessage: (msg) => {
        if (!isMounted) return;
        if (msg.type === 'INIT' && msg.poll) {
          setPoll(msg.poll);
        } else if (msg.type === 'VOTE_UPDATE' && msg.poll) {
          setPoll(msg.poll);
          // Visual pulse effect for real-time vote
          setRecentVotePulse(true);
          setTimeout(() => setRecentVotePulse(false), 800);
        } else if (msg.type === 'POLL_DELETED') {
          setError('This poll has been deleted by its creator.');
        }
      },
    });

    liveSocket.connect();

    return () => {
      isMounted = false;
      liveSocket.disconnect();
    };
  }, [code]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#94a3b8' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
        <p>Connecting to live poll stream...</p>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div style={{ maxWidth: '520px', margin: '4rem auto' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <AlertCircle size={44} style={{ color: '#f87171', margin: '0 auto 1rem auto' }} />
          <h2 className="card-title">Unable to Load Poll</h2>
          <p className="card-subtitle">{error}</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/" className="btn btn-primary">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate leader
  const highestVotes = Math.max(...(poll?.options?.map((o) => o.votes) || [0]));

  return (
    <div ref={containerRef} style={{ maxWidth: '780px', margin: '1.5rem auto' }}>
      <div className={`card ${recentVotePulse ? 'vote-celebration' : ''}`}>
        {/* Header with live status and actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #334155',
            paddingBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LiveBadge status={socketStatus} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              poll:{poll.code}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowShareModal(true)}
              className="btn btn-secondary btn-sm"
              title="Share Poll Link"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>

            <Link to={`/poll/${poll.code}`} className="btn btn-primary btn-sm" target="_blank">
              <Vote size={15} />
              <span>Cast Vote</span>
            </Link>

            <button
              onClick={toggleFullscreen}
              className="btn btn-secondary btn-sm"
              title="Toggle Fullscreen Presenter Mode"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* Poll Title & Stats */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="card-title" style={{ fontSize: '1.85rem', lineHeight: 1.3 }}>
            {poll.question}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.75rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f8fafc', fontWeight: 700 }}>
              <Users size={16} style={{ color: '#818cf8' }} />
              {poll.totalVotes} Total {poll.totalVotes === 1 ? 'Vote' : 'Votes'}
            </span>
            <span>•</span>
            <span>Created by {poll.creatorName}</span>
          </div>
        </div>

        {/* Live Animated Options Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {poll.options.map((opt) => (
            <ProgressBar
              key={opt.id}
              option={opt}
              totalVotes={poll.totalVotes}
              isLeader={highestVotes > 0 && opt.votes === highestVotes}
            />
          ))}
        </div>

        {/* Real-time Indicator Footer */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1rem',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '0.75rem',
            border: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#94a3b8',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={15} style={{ color: '#fbbf24' }} />
            <span>Updates stream in real time via Go WebSockets & Redis Pub/Sub</span>
          </div>
          <div style={{ color: '#cbd5e1' }}>No page refresh required</div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        code={poll.code}
        question={poll.question}
      />
    </div>
  );
}

export default LiveResults;
