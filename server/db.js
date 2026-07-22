import pg from 'pg';

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Neon (like most serverless Postgres) closes idle connections after a
// timeout. Without this listener, that background 'error' event on an idle
// pool client is treated as an uncaught exception and crashes the whole
// process — the pool itself still recovers fine on the next query.
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});
