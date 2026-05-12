import {
  WebSocketServer,
  WebSocket
} from 'ws';

import jwt from 'jsonwebtoken';

// ==========================================
// 🧠 TYPES
// ==========================================

type WSClient = {

  ws: WebSocket;

  userId?: number;

  role?: string;
};

// ==========================================
// 🚀 SERVER
// ==========================================

let wss:
  WebSocketServer | null = null;

// ==========================================
// 👥 CLIENTS
// ==========================================

const clients =
  new Set<WSClient>();

// ==========================================
// 🚀 INIT WS SERVER
// ==========================================

export function initWebSocket(
  server: any
) {

  wss =
    new WebSocketServer({

      server,

      path: '/ws',

      perMessageDeflate: false
    });

  wss.on(
    'connection',
    (
      ws: WebSocket,
      req
    ) => {

      try {

        // ==========================================
        // 🔐 TOKEN
        // ==========================================

        const url =
          new URL(
            req.url || '',
            'http://localhost'
          );

        const token =
          url.searchParams.get(
            'token'
          );

        if (!token) {

          console.log(
            '🔴 WS sem token'
          );

          ws.close();

          return;
        }

        // ==========================================
        // 🔓 VERIFY JWT
        // ==========================================

        const decoded: any =
          jwt.verify(
            token,
            process.env.JWT_SECRET!
          );

        // ==========================================
        // 👤 USER
        // ==========================================

        const userId =
          Number(decoded.sub);

        if (!userId) {

          console.log(
            '🔴 WS token inválido'
          );

          ws.close();

          return;
        }

        // ==========================================
        // 👤 CLIENT
        // ==========================================

        const client: WSClient = {

          ws,

          userId,

          role:
            decoded.role
        };

        clients.add(client);

        console.log(
          `🟢 WS CONNECTED USER ${userId}`
        );

        // ==========================================
        // 📨 CONNECTED EVENT
        // ==========================================

        ws.send(
          JSON.stringify({

            type: 'system',

            data: {

              status: 'connected',

              userId
            },

            timestamp:
              Date.now()
          })
        );

        // ==========================================
        // 📨 MESSAGE
        // ==========================================

        ws.on(
          'message',
          (raw: Buffer) => {

            try {

              const msg =
                JSON.parse(
                  raw.toString()
                );

              // ==========================================
              // ❤️ HEARTBEAT
              // ==========================================

              if (
                msg.type === 'ping'
              ) {

                ws.send(
                  JSON.stringify({
                    type: 'pong'
                  })
                );

                return;
              }

            } catch (error) {

              console.error(
                '❌ WS MESSAGE ERROR:',
                error
              );
            }
          }
        );

        // ==========================================
        // ❌ ERROR
        // ==========================================

        ws.on(
          'error',
          (err) => {

            console.log(
              '🔴 WS CLIENT ERROR:',
              err
            );
          }
        );

        // ==========================================
        // 🔌 CLOSE
        // ==========================================

        ws.on(
          'close',
          () => {

            clients.delete(
              client
            );

            console.log(
              `🔌 WS DISCONNECTED USER ${userId}`
            );
          }
        );

      } catch (error) {

        console.error(
          '🔴 WS AUTH FAILED:',
          error
        );

        ws.close();
      }
    }
  );

  console.log(
    '✅ WebSocket Server iniciado'
  );

  return wss;
}

// ==========================================
// 📡 BROADCAST
// ==========================================

export function broadcast(
  event: string,
  data: any
) {

  if (!wss) {

    console.log(
      '⚠️ WS ainda não inicializado'
    );

    return;
  }

  const payload =
    JSON.stringify({

      type: event,

      data,

      timestamp:
        Date.now()
    });

  clients.forEach(client => {

    if (
      client.ws.readyState ===
      WebSocket.OPEN
    ) {

      client.ws.send(
        payload
      );
    }
  });
}

// ==========================================
// 👤 SEND TO USER
// ==========================================

export function sendToUser(
  userId: number,
  event: string,
  data: any
) {

  const payload =
    JSON.stringify({

      type: event,

      data,

      timestamp:
        Date.now()
    });

  clients.forEach(client => {

    if (
      client.userId === userId &&
      client.ws.readyState ===
      WebSocket.OPEN
    ) {

      client.ws.send(
        payload
      );
    }
  });
}

// ==========================================
// 👑 SEND TO ROLE
// ==========================================

export function sendToRole(
  role: string,
  event: string,
  data: any
) {

  const payload =
    JSON.stringify({

      type: event,

      data,

      timestamp:
        Date.now()
    });

  clients.forEach(client => {

    if (
      client.role === role &&
      client.ws.readyState ===
      WebSocket.OPEN
    ) {

      client.ws.send(
        payload
      );
    }
  });
}

// ==========================================
// ⚽ COMPAT LAYER
// ==========================================

export function broadcastFootball(
  data: any
) {

  broadcast(
    'football',
    data
  );
}

export function broadcastOrchestrator(
  data: any
) {

  broadcast(
    'orchestrator',
    data
  );
}