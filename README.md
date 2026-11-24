# gameoff-2026

Phaser + Vite + Bun.

```bash
bun install
bun run dev
```

Create a production build in `build/`:

```bash
bun run build
```

In development, the extra-hint button shows its hint directly. The itch.io
deployment stays Phaser-only, while the Playgama deployment initializes Bridge
and bundles the rewarded-ad configuration:

```bash
bun run dev
bun run deploy:itchio
bun run deploy:playgama
```

The Playgama upload archive is written to `deploy/shift-playgama.zip`.

Preview the production build locally:

```bash
bun run preview
```

Run the TypeScript check:

```bash
bun run typecheck
```
