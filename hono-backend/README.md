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

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Database migrations (Drizzle + D1)

Generate SQL migrations from `src/db/schema.ts` (outputs to `drizzle/migrations`):

```txt
npx drizzle-kit generate
```

Apply migrations to the local D1 database:

```txt
npx wrangler d1 migrations apply TaskMaster --local
```

Apply migrations to the remote D1 database:

```txt
npx wrangler d1 migrations apply TaskMaster --remote
```
