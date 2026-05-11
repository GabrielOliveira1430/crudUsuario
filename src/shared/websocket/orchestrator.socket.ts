let ws: WebSocket | null = null;

export function connectOrchestratorWS(onMessage: (data: any) => void) {

  const url = 'ws://localhost:3000/ws';

  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log('⚡ WS conectado');
  };

  ws.onmessage = (event) => {

    try {
      const data = JSON.parse(event.data);
      onMessage(data.data || data);
    } catch (err) {
      console.error('WS parse error:', err);
    }
  };

  ws.onerror = (err) => {
    console.error('WS error:', err);
  };

  ws.onclose = () => {
    console.log('🔌 WS desconectado');

    // auto reconnect simples
    setTimeout(() => {
      connectOrchestratorWS(onMessage);
    }, 3000);
  };

  return ws;
}