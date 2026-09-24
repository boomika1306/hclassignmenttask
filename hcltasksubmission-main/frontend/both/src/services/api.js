const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Helper to perform fetch requests with auto-attached JWT auth headers
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('livepoll_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to backend server. Please check if the Go server is running.');
    }
    throw err;
  }
}

export const api = {
  // Authentication
  signup: (userData) => request('/signup', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/login', { method: 'POST', body: JSON.stringify(credentials) }),

  // Polls
  createPoll: (pollData) => request('/polls', { method: 'POST', body: JSON.stringify(pollData) }),
  getPollByCode: (code) => request(`/polls/${code}`, { method: 'GET' }),
  getMyPolls: () => request('/my-polls', { method: 'GET' }),
  deletePoll: (id) => request(`/polls/${id}`, { method: 'DELETE' }),

  // Voting
  submitVote: (code, optionId) =>
    request(`/polls/${code}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    }),

  // Health
  checkHealth: () => request('/health', { method: 'GET' }),
};

export default api;
