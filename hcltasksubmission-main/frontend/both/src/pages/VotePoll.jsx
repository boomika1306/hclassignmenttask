import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, Loader2, BarChart2, Radio, AlertCircle, Sparkles } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

export function VotePoll() {
  const { code } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const voteStorageKey = `livepoll_voted_${code}`;

  useEffect(() => {
    async function fetchPoll() {
      try {
        setLoading(true);
        const data = await api.getPollByCode(code);
        setPoll(data);

        // Check if previously voted
        const previousVote = localStorage.getItem(voteStorageKey);
        if (previousVote) {
          setHasVoted(true);
          setSelectedOption(previousVote);
        }
      } catch (err) {
        setError(err.message || 'Poll not found or inactive');
      } finally {
        setLoading(false);
      }
    }
    fetchPoll();
  }, [code]);

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) {
      setError('Please select an option to submit your vote');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await api.submitVote(code, selectedOption);
      
      // Fire confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#38bdf8', '#f59e0b'],
      });

      setHasVoted(true);
      localStorage.setItem(voteStorageKey, selectedOption);
      setSuccessMessage('🎉 Your vote has been recorded and pushed live!');
      if (res.poll) {
        setPoll(res.poll);
      }
    } catch (err) {
      setError(err.message || 'Failed to record vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#94a3b8' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
        <p>Loading interactive poll...</p>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <AlertCircle size={44} style={{ color: '#f87171', margin: '0 auto 1rem auto' }} />
          <h2 className="card-title">Poll Not Found</h2>
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

  // Find leading vote count
  const highestVotes = Math.max(...(poll?.options?.map((o) => o.votes) || [0]));

  return (
    <div style={{ maxWidth: '620px', margin: '2rem auto' }}>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              CODE: {poll.code}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Created by <strong style={{ color: '#cbd5e1' }}>{poll.creatorName}</strong>
            </span>
          </div>

          <h1 className="card-title" style={{ fontSize: '1.65rem' }}>
            {poll.question}
          </h1>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {!hasVoted ? (
          <form onSubmit={handleVoteSubmit}>
            <div className="vote-options-list">
              {poll.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`vote-option-card ${selectedOption === opt.id ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(opt.id)}
                >
                  <div className="vote-radio">
                    <div className="vote-radio-dot" />
                  </div>
                  <span className="vote-option-title">{opt.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <Link to={`/poll/${code}/results`} className="btn btn-secondary btn-sm">
                <BarChart2 size={15} />
                <span>View Live Results</span>
              </Link>

              <button
                type="submit"
                disabled={!selectedOption || submitting}
                className="btn btn-primary"
                style={{ minWidth: '140px' }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Vote</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                color: '#6ee7b7',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1.5rem',
              }}
            >
              <CheckCircle2 size={18} />
              <span>You have voted on this poll! Here are the current standings:</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {poll.options.map((opt) => (
                <ProgressBar
                  key={opt.id}
                  option={opt}
                  totalVotes={poll.totalVotes}
                  isLeader={highestVotes > 0 && opt.votes === highestVotes}
                  isUserChoice={selectedOption === opt.id}
                />
              ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link to={`/poll/${code}/results`} className="btn btn-primary">
                <Radio size={16} />
                <span>Open Fullscreen Live Results Stream</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VotePoll;
