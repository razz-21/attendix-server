import { createAdaptorServer } from '@hono/node-server';
import type { Server } from 'node:http';
import app from '../src/index.js';
import { initWebSocket } from '../src/realtime/realtime.js';

/**
 * Vercel Function entry (Fluid Compute).
 *
 * Use `createAdaptorServer` (NOT `serve`) so the returned `http.Server` never
 * calls `.listen()` — Vercel drives the exported server via its `request` and
 * `upgrade` event handlers directly, and a listening server hangs under
 * `@vercel/node`. HTTP routes and the `/ws` WebSocket share one server so a
 * connection and the broadcast targeting it live on the same instance.
 *
 * NOTE: `rooms` in realtime.ts is in-memory and per-instance, so broadcasts
 * only reach sockets on the same instance. Cross-instance fan-out needs
 * external pub/sub (e.g. Redis) — deferred for now.
 */
const server = createAdaptorServer({ fetch: app.fetch }) as unknown as Server;

initWebSocket(server);

export default server;
