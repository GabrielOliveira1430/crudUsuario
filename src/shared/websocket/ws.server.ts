import { WebSocketServer, WebSocket } from 'ws';

let wss: WebSocketServer | null = null;

// ==========================================
// 🚀 INIT WS SERVER
// ==========================================

export function initWebSocket(server: any) {

  wss = new WebSocketServer({
    server,
    path: '/ws'
  });

  wss.on('connection', (ws: WebSocket) => {

    console.log('⚡ CLIENT WS CONNECTED');

    ws.send(JSON.stringify({
      type: 'system',
      event: 'connected',
      data: {
        message: 'AI Trading WS ativo'
      }
    }));
  });

  return wss;
}

// ==========================================
// 📡 BASE BROADCAST (UNIFICADO)
// ==========================================

export function broadcast(event: string, data: any) {

  if (!wss) return;

  const payload = JSON.stringify({
    type: event,
    data,
    timestamp: Date.now()
  });

  wss.clients.forEach((client: any) => {

    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// ==========================================
// ⚽ FOOTBALL
// ==========================================

export function broadcastFootball(data: any) {
  broadcast('football:update', data);
}

// ==========================================
// 🧠 ORCHESTRATOR
// ==========================================

export function broadcastOrchestrator(data: any) {
  broadcast('orchestrator:update', data);
}