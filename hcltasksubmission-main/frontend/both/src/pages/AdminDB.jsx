import React, { useState, useEffect } from 'react';
import { Database, Activity, RefreshCw, Users, FileText, CheckCircle2, AlertCircle, ExternalLink, ShieldAlert, Layers } from 'lucide-react';

export function AdminDB() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'polls' | 'users' | 'guide'
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      setError('');
      const res = await fetch(`${API_BASE}/admin/db-stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError('Unable to contact backend diagnostics endpoint. Ensure Go server is active.');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchCollectionDocs = async (collectionName) => {
    try {
      setLoadingDocs(true);
      const res = await fetch(`${API_BASE}/admin/collections/${collectionName}`);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to read documents from ${collectionName}`);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'polls' || activeTab === 'users') {
      fetchCollectionDocs(activeTab);
    }
  }, [activeTab]);

  const isMongoConnected = stats?.status === 'connected';
  const isRedisConnected = stats?.redisStatus === 'connected';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 className="card-title" style={{ fontSize: '1.75rem' }}>MongoDB Manual Dashboard</h1>
                <span
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                  }}
                >
                  ADMIN VIEW
                </span>
              </div>
              <p className="card-subtitle">
                Live inspection of MongoDB collections, database latency, and Redis Pub/Sub status
              </p>
            </div>
          </div>

          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Diagnostics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {/* MongoDB Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>MONGODB STATUS</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: isMongoConnected ? '#34d399' : '#f87171',
              }}
            >
              {isMongoConnected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {isMongoConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stats?.databaseName || 'livepoll'}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', wordBreak: 'break-all', marginTop: '0.25rem' }}>
              URI: {stats?.mongoUri || 'mongodb://localhost:27017'}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '0.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            Ping Latency: <strong style={{ color: '#f8fafc' }}>{stats?.pingMs ?? '--'} ms</strong>
          </div>
        </div>

        {/* Redis Real-Time Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>REDIS PUB/SUB ENGINE</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: isRedisConnected ? '#34d399' : '#f87171',
              }}
            >
              {isRedisConnected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {isRedisConnected ? 'ACTIVE' : 'DISCONNECTED'}
            </span>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Redis Message Broker</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Address: {stats?.redisAddr || 'localhost:6379'}
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '0.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            Channel Scheme: <strong style={{ color: '#38bdf8' }}>poll:&#123;code&#125;</strong>
          </div>
        </div>

        {/* Collections Overview Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>STORED COLLECTIONS</span>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {stats?.collections?.map((col) => (
              <div
                key={col.name}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  flex: 1,
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>{col.name}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', marginTop: '0.2rem' }}>
                  {col.count}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>docs</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Activity size={15} />
          <span>System Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('polls')}
          className={`btn btn-sm ${activeTab === 'polls' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Layers size={15} />
          <span>MongoDB "polls" Collection</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={15} />
          <span>MongoDB "users" Collection</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`btn btn-sm ${activeTab === 'guide' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <ExternalLink size={15} />
          <span>Compass & Mongo Express</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="card">
          <h2 className="card-title" style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
            Live Architectural Flow Verification
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            This system strictly implements the GUVI HCL requirements where MongoDB handles permanent document persistence and Redis Pub/Sub drives zero-refresh real-time vote broadcasts.
          </p>

          <div
            style={{
              background: '#0b1120',
              padding: '1.25rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#38bdf8',
              lineHeight: 1.8,
              border: '1px solid #1e293b',
            }}
          >
            <div>[1] Voter Client (React) ➔ HTTP POST /api/polls/:code/vote</div>
            <div>[2] Go (Gin Handler) ➔ Validates input & verifies poll exists</div>
            <div>[3] MongoDB ➔ Atomic $inc of option vote & poll totalVotes</div>
            <div>[4] Go Service ➔ Publishes JSON event to Redis channel "poll:&#123;code&#125;"</div>
            <div>[5] Redis Pub/Sub ➔ Dispatches event to Go WebSocket Hub subscribers</div>
            <div>[6] WebSocket Server ➔ Transmits frame to all connected browsers</div>
            <div>[7] React Audience ➔ Updates animated progress bars in real-time (NO PAGE REFRESH)</div>
          </div>
        </div>
      )}

      {(activeTab === 'polls' || activeTab === 'users') && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="card-title" style={{ fontSize: '1.35rem' }}>
              Collection: <span style={{ color: '#818cf8' }}>{activeTab}</span> ({documents.length} records)
            </h2>
            <button onClick={() => fetchCollectionDocs(activeTab)} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} className={loadingDocs ? 'animate-spin' : ''} />
              <span>Reload Documents</span>
            </button>
          </div>

          {loadingDocs ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              Reading documents directly from MongoDB...
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No documents found in collection "{activeTab}". Create an account or a poll to see records appear here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {documents.map((doc, idx) => (
                <div
                  key={doc.id || doc._id || idx}
                  style={{
                    background: '#0b1120',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <span>
                      Doc #{idx + 1} • <strong style={{ color: '#a5b4fc' }}>ID: {doc.id || doc._id}</strong>
                    </span>
                    <span>Created: {new Date(doc.createdAt).toLocaleString()}</span>
                  </div>

                  <pre
                    style={{
                      margin: 0,
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '6px',
                      overflowX: 'auto',
                      fontSize: '0.8rem',
                      color: '#a7f3d0',
                      fontFamily: 'monospace',
                    }}
                  >
                    {JSON.stringify(doc, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="card">
          <h2 className="card-title" style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
            External Database GUIs & Tools
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
                1. MongoDB Compass
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                You can open the official MongoDB Compass GUI desktop app and connect using:
              </p>
              <code style={{ background: '#0b1120', padding: '0.3rem 0.6rem', borderRadius: '4px', color: '#34d399' }}>
                mongodb://localhost:27017
              </code>
              <p style={{ marginTop: '0.5rem', color: '#94a3b8' }}>
                Navigate to database: <strong>livepoll</strong> ➔ Collections: <strong>users</strong>, <strong>polls</strong>
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.5rem' }}>
                2. Mongo Express (Docker Web Dashboard)
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                When running the included <code>docker-compose.yml</code> file, a lightweight web administration GUI is launched on:
              </p>
              <a
                href="http://localhost:8081"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#818cf8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                http://localhost:8081 <ExternalLink size={14} />
              </a>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.5rem' }}>
                3. Redis CLI
              </h3>
              <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                To monitor live Redis Pub/Sub events in your terminal:
              </p>
              <pre style={{ background: '#0b1120', padding: '0.5rem', borderRadius: '4px', color: '#fb7185', fontSize: '0.85rem' }}>
                redis-cli PSUBSCRIBE "poll:*"
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDB;
