import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, BarChart2, Users, Radio, ExternalLink, ArrowRight, Database, Loader2, Sparkles } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPolls: 0, totalVotes: 0, polls: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getMyPolls();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Hero Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(30, 41, 59, 0.9) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <Sparkles size={16} />
              <span>User Control Hub</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Welcome back, <span style={{ color: '#818cf8' }}>{user?.name || 'Creator'}</span>!
            </h1>
            <p style={{ color: '#94a3b8', marginTop: '0.35rem', fontSize: '1rem' }}>
              Create audience polls, share instant links, and monitor live voting results in real time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Create Poll</span>
            </Link>
            <Link to="/admin/db" className="btn btn-secondary" title="Open MongoDB Manual Dashboard">
              <Database size={17} />
              <span>DB Explorer</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Polls
              </p>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
                {loading ? <Loader2 size={24} className="animate-spin" /> : stats.totalPolls}
              </h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderRadius: '12px' }}>
              <BarChart2 size={24} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            Active interactive polls created by you
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Total Audience Votes
              </p>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem', color: '#34d399' }}>
                {loading ? <Loader2 size={24} className="animate-spin" /> : stats.totalVotes}
              </h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: '12px' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            Recorded across all your live sessions
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Real-Time Engine
              </p>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.5rem', color: '#38bdf8' }}>
                Redis Pub/Sub
              </h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', borderRadius: '12px' }}>
              <Radio size={24} />
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            Push updates via Go WebSockets active
          </div>
        </div>
      </div>

      {/* Recent Polls Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="card-title">Recent Polls</h2>
            <p className="card-subtitle">Quickly launch live results or share voting links</p>
          </div>
          <Link to="/my-polls" className="btn btn-secondary btn-sm">
            <span>Manage All Polls</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
            <p>Loading your polls...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : stats.polls?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}>
            <BarChart2 size={40} style={{ color: '#475569', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>No polls created yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Create your first live poll and invite your audience to vote!
            </p>
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create a Poll</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.polls.slice(0, 4).map((poll) => (
              <div
                key={poll.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#818cf8',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                      }}
                    >
                      {poll.code}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{poll.question}</h3>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {poll.options?.length} choices • <strong style={{ color: '#f8fafc' }}>{poll.totalVotes}</strong> votes received
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/poll/${poll.code}/results`} className="btn btn-primary btn-sm">
                    <Radio size={14} />
                    <span>Live Stream</span>
                  </Link>
                  <Link to={`/poll/${poll.code}`} className="btn btn-secondary btn-sm" target="_blank">
                    <ExternalLink size={14} />
                    <span>Vote View</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
