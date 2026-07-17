import { serve } from '@hono/node-server'
import type { Server } from 'node:http'
import app from './index.js'
import { initWebSocket } from './realtime/realtime.js'
const port = Number(process.env.PORT ?? 3000)

const server = serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})

// serve() returns an http.Server in this (HTTP/1.1) setup.
initWebSocket(server as Server)