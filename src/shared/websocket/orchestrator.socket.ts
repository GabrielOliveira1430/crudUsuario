let ws: WebSocket | null = null;
let reconnectAttempts = 0;
let isManualClose = false;
let isConnecting = false;

export function connectOrchestratorWS(onMessage: (data: any) => void) {

  const url =
    typeof window !== 'undefined'
      ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:3000/ws`
      : 'ws://localhost:3000/ws';

  function connect() {

    if (isConnecting || ws?.readyState === WebSocket.OPEN) return;

    isConnecting = true;

    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('⚡ WS conectado');

      reconnectAttempts = 0;
      isConnecting = false;
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        onMessage(msg.data ?? msg);
      } catch (err) {
        console.error('WS parse error:', err);
      }
    };

    ws.onerror = () => {
      console.error('WS error');
    };

    ws.onclose = () => {

      console.log('🔌 WS desconectado');

      isConnecting = false;

      if (isManualClose) return;

      const timeout = Math.min(1000 * 2 ** reconnectAttempts, 10000);

      reconnectAttempts++;

      setTimeout(connect, timeout);
    };
  }

  connect();

  return {
    close: () => {
      isManualClose = true;
      ws?.close();
    }
  };
}