## Play it live

The app is served from two independent sources, both auto-deployed from `main` on every push:

- **[marsonmao.github.io/piccollage-assignment](https://marsonmao.github.io/piccollage-assignment/)** — static export published via GitHub Actions (see `.github/workflows/deploy-pages.yml`).
- **[piccollage-assignment-marsonmaos-projects.vercel.app](https://piccollage-assignment-marsonmaos-projects.vercel.app/)** — built and hosted by Vercel via its GitHub App integration (configured in the Vercel dashboard, not tracked in this repo).

## Getting started

Install dependencies with Node >= 18.17:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:30305](http://localhost:30305) with your browser to play 💣💣💣

## Tech stack

1. NextJS / React: to leverage the state-of-the-art React starter; mainly rely on the default config and the convenient deployment system provided
1. Tailwind CSS: just trying this cool thing and it currently fits the requirement without troubles
1. Eslint: added a rule for detecting unused vars
1. Prettier: added a plugin to sort imports automatically

## Backlog

- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Security

Dependencies are kept patched via `npm audit`. One known moderate/high advisory remains open in PostCSS, bundled transitively by Next.js; fixing it requires upgrading to Next.js 16 (a breaking change) and is tracked separately rather than forced in as part of a routine dependency bump.
