import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Radio, ExternalLink, Share2, Trash2, Search, PlusCircle, Loader2, AlertCircle } from 'lucide-react';
import ShareModal from '../components/ShareModal';

export function MyPolls() {
  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSharePoll, setActiveSharePoll] = useState(null);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await api.getMyPolls();
      setPolls(data.polls || []);
    } catch (err) {
      setError(err.message || 'Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pollToDelete) return;
    try {
      setIsDeleting(true);
      await api.deletePoll(pollToDelete.id);
      setPolls(polls.filter((p) => p.id !== pollToDelete.id));
      setPollToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete poll');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPolls = polls.filter(
    (p) =>
      p.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="card-title">My Created Polls</h1>
          <p className="card-subtitle">Manage, share, and track all your active polling sessions</p>
        </div>

        <Link to="/create" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>New Poll</span>
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search Filter */}
      <div style={{ position: 'relative', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Search by question or poll code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
        />
        <Search
          size={16}
          style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
        />
      </div>

      {/* Polls List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
          <p>Loading your polls...</p>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <AlertCircle size={40} style={{ color: '#64748b', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No polls found</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            {searchTerm ? 'No results matched your search term.' : "You haven't created any live polls yet."}
          </p>
          <Link to="/create" className="btn btn-primary">
            Create Your First Poll
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredPolls.map((poll) => (
            <div key={poll.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#a5b4fc',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                      }}
                    >
                      {poll.code}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Created {new Date(poll.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
                    {poll.question}
                  </h3>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <span>
                      <strong style={{ color: '#38bdf8' }}>{poll.totalVotes}</strong> total votes
                    </span>
                    <span>•</span>
                    <span>{poll.options?.length} choices</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link to={`/poll/${poll.code}/results`} className="btn btn-primary btn-sm">
                    <Radio size={14} />
                    <span>Live Stream</span>
                  </Link>

                  <Link to={`/poll/${poll.code}`} className="btn btn-secondary btn-sm" target="_blank">
                    <ExternalLink size={14} />
                    <span>Vote Link</span>
                  </Link>

                  <button
                    onClick={() => setActiveSharePoll(poll)}
                    className="btn btn-secondary btn-sm"
                    title="Share Link"
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => setPollToDelete(poll)}
                    className="btn btn-danger btn-sm"
                    title="Delete Poll"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {activeSharePoll && (
        <ShareModal
          isOpen={true}
          onClose={() => setActiveSharePoll(null)}
          code={activeSharePoll.code}
          question={activeSharePoll.question}
        />
      )}

      {/* Delete Confirmation Modal */}
      {pollToDelete && (
        <div className="modal-backdrop" onClick={() => setPollToDelete(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f87171' }}>
              Confirm Delete Poll
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Are you sure you want to delete the poll "{pollToDelete.question}"? All vote data will be permanently removed from MongoDB and connected viewers will be notified.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setPollToDelete(null)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="btn btn-danger btn-sm"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Poll'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPolls;
