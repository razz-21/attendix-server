import type { IncomingMessage, Server } from 'node:http';
import type { Duplex } from 'node:stream';
import { verify } from 'hono/jwt';
import { WebSocket, WebSocketServer } from 'ws';
import { AUTH_COOKIES } from '../constants/auth.constant.js';

/**
 * Realtime WebSocket hub for attendance records.
 *
 * Dashboard clients connect to `GET /ws?attendances_id=<id>` (upgraded to a
 * WebSocket). Each connection joins a "room" keyed by `attendances_id`. When a
 * record is created or updated anywhere on the server, we broadcast the change
 * to every socket in that room so the UI updates without a refresh.
 */

const WS_PATH = '/ws';
const HEARTBEAT_INTERVAL_MS = 30_000;

export type RealtimeEventType = 'record.created' | 'record.updated';

interface RealtimeMessage<T = unknown> {
  type: RealtimeEventType;
  attendances_id: string;
  data: T;
}

interface AttendanceSocket extends WebSocket {
  attendancesId?: string;
  isAlive?: boolean;
}

// attendances_id -> set of connected sockets
const rooms = new Map<string, Set<AttendanceSocket>>();

let wss: WebSocketServer | null = null;

/** Parse a raw `Cookie` header into a plain object. */
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const jar: Record<string, string> = {};
  if (!cookieHeader) return jar;

  for (const part of cookieHeader.split(';')) {
    const index = part.indexOf('=');
    if (index === -1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) jar[key] = decodeURIComponent(value);
  }

  return jar;
}

/**
 * Authenticate a WebSocket handshake using the same cookies as the HTTP API.
 * A valid (unexpired) access OR refresh token is required. Returns `true` when
 * the connection may proceed.
 */
async function isAuthorized(req: IncomingMessage): Promise<boolean> {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!accessSecret || !refreshSecret) return false;

  const cookies = parseCookies(req.headers.cookie);
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const accessToken = cookies[AUTH_COOKIES.ACCESS_TOKEN] ?? bearer;
  const refreshToken = cookies[AUTH_COOKIES.REFRESH_TOKEN];

  if (accessToken) {
    try {
      await verify(accessToken, accessSecret, 'HS256');
      return true;
    } catch {
      // fall through to refresh token
    }
  }

  if (refreshToken) {
    try {
      await verify(refreshToken, refreshSecret, 'HS256');
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

function joinRoom(socket: AttendanceSocket, attendancesId: string): void {
  socket.attendancesId = attendancesId;
  let room = rooms.get(attendancesId);
  if (!room) {
    room = new Set();
    rooms.set(attendancesId, room);
  }
  room.add(socket);
}

function leaveRoom(socket: AttendanceSocket): void {
  const attendancesId = socket.attendancesId;
  if (!attendancesId) return;
  const room = rooms.get(attendancesId);
  if (!room) return;
  room.delete(socket);
  if (room.size === 0) rooms.delete(attendancesId);
}

/** Attach the WebSocket server to the shared HTTP server. */
export function initWebSocket(server: Server): void {
  if (wss) return;

  wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    let pathname = '';
    try {
      pathname = new URL(req.url ?? '', 'http://localhost').pathname;
    } catch {
      socket.destroy();
      return;
    }

    if (pathname !== WS_PATH) return; // not ours; let other handlers deal with it

    void isAuthorized(req).then((authorized) => {
      if (!authorized) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss!.handleUpgrade(req, socket, head, (ws) => {
        wss!.emit('connection', ws, req);
      });
    });
  });

  wss.on('connection', (ws: AttendanceSocket, req: IncomingMessage) => {
    let attendancesId: string | null = null;
    try {
      attendancesId = new URL(req.url ?? '', 'http://localhost').searchParams.get('attendances_id');
    } catch {
      attendancesId = null;
    }

    if (!attendancesId) {
      ws.close(1008, 'attendances_id is required');
      return;
    }

    ws.isAlive = true;
    joinRoom(ws, attendancesId);

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Allow clients to switch the room they are subscribed to without
    // reconnecting (e.g. navigating between attendance detail pages).
    ws.on('message', (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        if (message?.type === 'subscribe' && typeof message.attendances_id === 'string') {
          leaveRoom(ws);
          joinRoom(ws, message.attendances_id);
        }
      } catch {
        // ignore malformed client messages
      }
    });

    ws.on('close', () => leaveRoom(ws));
    ws.on('error', () => leaveRoom(ws));
  });

  // Terminate dead connections so rooms don't leak sockets.
  const heartbeat = setInterval(() => {
    for (const client of wss!.clients as Set<AttendanceSocket>) {
      if (client.isAlive === false) {
        client.terminate();
        continue;
      }
      client.isAlive = false;
      client.ping();
    }
  }, HEARTBEAT_INTERVAL_MS);

  wss.on('close', () => clearInterval(heartbeat));

  console.log(`WebSocket server listening on ${WS_PATH}`);
}

/** Broadcast a realtime event to every client watching an attendance event. */
export function broadcastToAttendance<T>(
  attendancesId: string,
  type: RealtimeEventType,
  data: T,
): void {
  const room = rooms.get(attendancesId);
  if (!room || room.size === 0) return;

  const message: RealtimeMessage<T> = { type, attendances_id: attendancesId, data };
  const serialized = JSON.stringify(message);

  for (const client of room) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(serialized);
    }
  }
}
