import { connectDB } from '@config/db.config'
import usersRoutes from './api/users/routes/users.routes'
import { cors } from 'hono/cors';
import 'hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import authRoutes from './api/auth/routes/auth.routes';
import meRoutes from './api/me/routes/me.routes';

const app = new OpenAPIHono();

await connectDB();

const welcomeStrings = [
  'Hello World!',
  'Welcome to the ATTENDIX SERVER API!',
];

app.use('*', cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [''],
  credentials: true,
}));

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
});

app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/me', meRoutes);
app.route('/api/v1/users', usersRoutes);

app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Attendix Server API',
  },
});

export default app