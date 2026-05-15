import React, { useEffect, useRef, useState } from 'react';

export default function SessionViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Connecting...');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const shareToken = window.location.pathname.split('/')[2];
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/api/terminal/${shareToken}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      setStatus('🟢 Connected');
    };

    ws.onerror = () => {
      setStatus('❌ Error');
      setIsConnected(false);
    };

    ws.onclose = () => {
      setStatus('🔴 Disconnected');
      setIsConnected(false);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">CoShell Live Terminal</h1>
          <div className={`px-3 py-1 rounded text-sm ${isConnected ? 'bg-green-900' : 'bg-red-900'}`}>
            {status}
          </div>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 p-4 font-mono text-sm overflow-auto">
        <div className="text-gray-300">{isConnected ? '🔌 Connected' : '⏳ Connecting...'}</div>
      </div>
    </div>
  );
}
