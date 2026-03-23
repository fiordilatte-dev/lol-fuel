# FuelWatch Australia

A satirical-yet-informative web app tracking Australia's fuel crisis in real time. Part dashboard, part comedy roast, part public service announcement.

## Tech Stack

- **Next.js 14+** (App Router) — server components, API routes, ISR
- **Tailwind CSS** — dark theme by default
- **Framer Motion** — price ticker animations
- **SWR** — client-side polling for live prices
- **Recharts** — historical price charts
- **Vercel** — hosting, KV, Postgres, cron jobs

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your API keys in .env.local

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/       # React components (hero, states, satire, timeline, ui)
├── content/          # Static content (headlines, timeline, comparisons)
├── hooks/            # Custom React hooks (useFuelPrices, useBlameVote)
├── lib/              # Data fetchers, normaliser, aggregator, DB/KV clients
└── types/            # TypeScript interfaces
```

## Environment Variables

See `.env.example` for required variables.

## Development

The app runs with mock data by default. To connect real data sources:

1. Obtain API keys for NSW FuelCheck and FuelPrice.io
2. Provision Vercel KV and Postgres stores
3. Uncomment the production code in API routes and cron handler
4. Deploy to Vercel with cron jobs enabled

## License

MIT
