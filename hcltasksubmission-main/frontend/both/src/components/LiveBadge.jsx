import React from 'react';
import { Radio, Wifi, WifiOff } from 'lucide-react';

export function LiveBadge({ status = 'connected' }) {
  const isLive = status === 'connected';

  return (
    <div className={`live-badge ${isLive ? 'connected' : ''}`}>
      <span className="live-dot" />
      {isLive ? (
        <>
          <span>LIVE UPDATES</span>
        </>
      ) : status === 'reconnecting' ? (
        <>
          <Radio size={12} className="animate-spin" />
          <span>RECONNECTING...</span>
        </>
      ) : (
        <>
          <WifiOff size={12} />
          <span>OFFLINE</span>
        </>
      )}
    </div>
  );
}

export default LiveBadge;
