import { betterAuth } from 'better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { pool } from './db.js';

const baseURL = process.env.BETTER_AUTH_URL || process.env.RENDER_EXTERNAL_URL;

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [process.env.BETTER_AUTH_URL, process.env.RENDER_EXTERNAL_URL].filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      phone: { type: 'string', required: false },
    },
    deleteUser: {
      enabled: true,
    },
  },
});

export async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ error: 'Sign in required' });
  req.user = session.user;
  next();
}
