# YatraFlow — VS Code setup

## Requirements

- Node.js 22 or newer
- pnpm 10 or newer
- MySQL or TiDB for the full-stack database features
- A Google Maps/Places-capable Manus environment, or equivalent map proxy configuration

## Run locally

```bash
pnpm install
cp .env.example .env
# Fill the environment variables in .env
pnpm check
pnpm test
pnpm dev
```

Then open `http://localhost:3000`.

## Production build

```bash
pnpm build
pnpm start
```

## Environment variables

The original project uses Manus-provided runtime variables for OAuth, database access, storage, maps, and built-in APIs. Use your own values when running outside Manus. See `server/_core/env.ts` for the supported variable names.

At minimum, configure the database and session values required by the backend. Google Maps search uses the frontend forge URL and key exposed through the Vite environment variables.

## Main source files

- `client/src/pages/Home.tsx` — complete YatraFlow homepage and interactions
- `client/src/components/Map.tsx` — Google Maps loader and map component
- `server/routers.ts` — trip discovery, weather, routes, feedback, and optimizer procedures
- `drizzle/schema.ts` — database schema
- `server/db.ts` — database helpers

Never commit real `.env` files, API keys, OAuth secrets, or database credentials.

## Notes

The app includes Manus OAuth and Manus storage integrations in the original scaffold. If you deploy outside Manus, replace those integrations with your own auth, storage, map proxy, and API credentials before production use.
