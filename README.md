# Vardehuset

Nettside for Kulturhuset Varde og Mannskoret Varde – [vardehuset.no](https://vardehuset.no).

## Stack

- Vite + React 19
- Tailwind CSS v4
- React Router
- Supabase (forespørsler, kalender, redigerbart innhold)
- Deploy: Vercel

## Utvikling

```bash
npm install
npm run dev      # start lokal dev-server
npm run build    # produksjonsbygg
npm run preview  # forhåndsvis bygg
```

## Miljøvariabler

Kopier `.env.example` til `.env` og fyll inn Supabase-nøkler:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
