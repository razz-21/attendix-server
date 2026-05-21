import { connectDB } from './config/db.config.js'
import usersRoutes from './api/users/users.routes.js'
import attendanceRoutes from './api/attendances/attendance.routes.js'
import { cors } from 'hono/cors';
import 'hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import authRoutes from './api/auth/routes/auth.routes.js';
import meRoutes from './api/me/me.routes.js';
import workspaceRoutes from './api/workspace/workspace.routes.js';
import groupRoutes from './api/groups/groups.routes.js'; 
import dashboardRoutes from './api/dashboard/dashboard.routes.js';
import { requireRole } from './middleware/role.middleware.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = new OpenAPIHono();

await connectDB();

const welcomeStrings = [
  'Hello World!',
  'Welcome to the ATTENDIX SERVER API!',
];

app.use('*', cors({
  origin: (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  credentials: true,
}));

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
});

app.use('/api/v1/users/*', authMiddleware, requireRole('admin'));
app.use('/api/v1/workspaces/*', authMiddleware, requireRole('admin'));
app.use('/api/v1/attendances/*', authMiddleware, requireRole('admin', 'user'));
app.use('/api/v1/groups/*', authMiddleware, requireRole('admin', 'user'));
app.use('/api/v1/dashboard/*', authMiddleware, requireRole('admin', 'user'));


app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/me', meRoutes);
app.route('/api/v1/users', usersRoutes);
app.route('/api/v1/workspaces', workspaceRoutes);
app.route('/api/v1/groups', groupRoutes); 
app.route('/api/v1/attendances', attendanceRoutes);
app.route('/api/v1/dashboard', dashboardRoutes);


app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Attendix Server API',
  },
});

export default app