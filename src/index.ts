import { Hono } from 'hono';
import { D1Database } from '@cloudflare/workers-types';

// Define environment shape
type Env = {
  Bindings: {
    MY_DB: D1Database;
  };
};

const app = new Hono<Env>();

app.get('/', (c) => {
  return c.text('JSON Storage API with Name is running.');
});

app.post('/save', async (c) => {
  try {
    const body = await c.req.json<{ name?: string; data?: unknown }>();
    const { name, data } = body;

    if (!name) return c.json({ error: "'name' field is required" }, 400);
    if (data === undefined) return c.json({ error: "'data' field is required" }, 400);

    const result = await c.env.MY_DB.prepare(
      'INSERT INTO json_data (name, data) VALUES (?, ?)'
    )
      .bind(name, JSON.stringify(data))
      .run();

    return c.json({ success: true, id: result.meta.last_row_id });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  };
});

app.get('/get/:id', async (c) => {
  const id = c.req.param('id');

  const row = await c.env.MY_DB.prepare(
    'SELECT id, name, data FROM json_data WHERE id = ?'
  )
    .bind(id)
    .first<{ id: number; name: string; data: string }>();

  if (!row) return c.json({ error: 'Record not found' }, 404);

  let parsed: unknown;
  try {
    parsed = JSON.parse(row.data);
  } catch {
    parsed = null;
  };

  return c.json({
    id: row.id,
    name: row.name,
    data: parsed,
  });
});

app.get('/all', async (c) => {
  const rows = await c.env.MY_DB.prepare(
    'SELECT id, name, data FROM json_data'
  ).all<{ id: number; name: string; data: string }>();

  const results = rows.results.map((r) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(r.data);
    } catch {
      parsed = null;
    };
    return { id: r.id, name: r.name, data: parsed };
  });

  return c.json(results);
});

export default app;