/**
 * LivePoll WebSocket Service
 * Handles resilient real-time WebSocket connection to /api/polls/:code/live
 */
export class LivePollSocket {
  constructor(pollCode, { onMessage, onStatusChange }) {
    this.pollCode = pollCode;
    this.onMessage = onMessage || (() => {});
    this.onStatusChange = onStatusChange || (() => {});
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.isExplicitlyClosed = false;
    this.reconnectTimer = null;
  }

  connect() {
    this.isExplicitlyClosed = false;
    this.onStatusChange('connecting');

    // Determine WS protocol and URL
    const isSecure = window.location.protocol === 'https:';
    const wsProtocol = isSecure ? 'wss:' : 'ws:';
    
    // Check if custom VITE_API_URL is configured
    const apiUrl = import.meta.env.VITE_API_URL || '';
    let wsHost = window.location.host;

    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
      const parsed = new URL(apiUrl);
      wsHost = parsed.host;
    }

    const wsUrl = `${wsProtocol}//${wsHost}/api/polls/${this.pollCode}/live`;
    console.log(`🔌 Connecting to Live WebSocket: ${wsUrl}`);

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log(` Connected to live poll stream [${this.pollCode}]`);
        this.reconnectAttempts = 0;
        this.onStatusChange('connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessage(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message JSON:', err);
        }
      };

      this.socket.onclose = (event) => {
        if (!this.isExplicitlyClosed) {
          console.warn(`⚠️ WebSocket closed unexpectedly (code ${event.code}). Retrying...`);
          this.onStatusChange('reconnecting');
          this.scheduleReconnect();
        } else {
          this.onStatusChange('disconnected');
        }
      };

      this.socket.onerror = (err) => {
        console.error('WebSocket connection error:', err);
        this.socket?.close();
      };
    } catch (err) {
      console.error('Failed to create WebSocket instance:', err);
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.isExplicitlyClosed || this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.onStatusChange('disconnected');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
    console.log(`⏱️ Scheduling reconnect attempt #${this.reconnectAttempts} in ${Math.round(delay)}ms`);

    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.onStatusChange('disconnected');
  }
}
