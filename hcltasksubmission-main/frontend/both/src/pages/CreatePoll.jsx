import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, HelpCircle, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import ShareModal from '../components/ShareModal';

export function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdPoll, setCreatedPoll] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length >= 10) {
      setError('Maximum 10 options allowed per poll');
      return;
    }
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      setError('A poll must have at least 2 options');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 5) {
      setError('Poll question must be at least 5 characters');
      return;
    }

    const filteredOptions = options.map((opt) => opt.trim()).filter(Boolean);
    if (filteredOptions.length < 2) {
      setError('Please provide at least 2 valid, non-empty options');
      return;
    }

    // Check duplicate options
    const uniqueOptions = new Set(filteredOptions.map((o) => o.toLowerCase()));
    if (uniqueOptions.size !== filteredOptions.length) {
      setError('Each poll option must be unique');
      return;
    }

    try {
      setLoading(true);
      const poll = await api.createPoll({
        question: trimmedQuestion,
        options: filteredOptions,
      });

      setCreatedPoll(poll);
      setShowShareModal(true);
    } catch (err) {
      setError(err.message || 'Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '1.5rem auto' }}>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
            <Sparkles size={16} />
            <span>Interactive Poll Creator</span>
          </div>
          <h1 className="card-title">Create a Live Poll</h1>
          <p className="card-subtitle">Define your question and options. An instant live link will be generated.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Question Input */}
          <div className="form-group">
            <label className="form-label" htmlFor="question">
              Poll Question or Topic
            </label>
            <textarea
              id="question"
              required
              rows={3}
              placeholder="e.g. Which programming language do you prefer for cloud backend services?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="form-textarea"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Dynamic Options List */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Voting Options (Min 2, Max 10)</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{options.length}/10 Options</span>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {options.map((opt, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#a5b4fc',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="form-input"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.65rem', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                      title="Remove option"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.85rem', alignSelf: 'flex-start' }}
              >
                <Plus size={15} />
                <span>Add Another Option</span>
              </button>
            )}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '150px' }}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Launch Live Poll</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Share Modal on successful creation */}
      {createdPoll && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            navigate(`/poll/${createdPoll.code}/results`);
          }}
          code={createdPoll.code}
          question={createdPoll.question}
        />
      )}
    </div>
  );
}

export default CreatePoll;
