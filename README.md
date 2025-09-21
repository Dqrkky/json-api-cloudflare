```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

# JSON Storage API (Cloudflare D1 + Hono)
Serverless JSON storage API using Cloudflare Workers and D1.

## API Endpoints

- `GET /` - Health check
- `POST /save` - Save JSON `{ "name": "str", "data": {...} }`
- `GET /get/:id` - Get JSON by ID
- `GET /all` - Get all JSON records
