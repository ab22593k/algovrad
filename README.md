# Algovrad

Algeria ministers radar + Puter.js AI agent (Angular 22, SSR, trilingual FR/AR/EN).

> **Single source of truth:** [Bun](https://bun.sh) owns install, build, test and run.
> `package.json` scripts + `bunfig.toml` + `bun.lock` are the only toolchain config —
> `package-lock.json` was removed and `angular.json` also points at `bun`.
> The SSR server (`src/server.ts`, run with Bun) serves the app **and** a
> `/api/*` bridge over the same `government-data.ts` module the UI uses, so
> external agents (e.g. a DeepSeek-Harness plugin) read identical data.

```bash
bun install     # install (writes bun.lock)
bun run dev     # dev server → http://localhost:4200/
bun run build   # production build → dist/
bun run serve   # build + serve SSR with Bun → http://localhost:4000/
bun run test    # unit tests (Vitest)
```

## Agent API bridge (for dsh / external agents)

Puter.js (AI, KV, auth User-Pays) stays client-side in the browser. Agents fetch
seed truth over HTTP, then use `puter.ai.chat` for live re-verification:

| Endpoint                | Content                                    |
| ----------------------- | ------------------------------------------ |
| `GET /api/health`       | `{ ok, app, runtime, time }`               |
| `GET /api/ministers`    | 38 ministers, `formationDate`, `decreeRef` |
| `GET /api/radar`        | radar items, `lastCouncilDate`             |
| `GET /api/sources`      | 12 monitored official sources with details |
| `GET /api/agent-system` | agent system prompt                        |

Example dsh-plugin usage: `GET /api/ministers` → diff vs
`https://premier-ministre.gov.dz/fr/gouvernement/composition` → report new drops.

## Puter.js console notes (Firefox `wss://api.puter.com` errors)

Puter.js opens its own socket.io connection when its SDK loads. The app loads
the SDK **lazily** (first sign-in / AI / radar-refresh click only), so plain
browsing is silent. If you still see `wss://api.puter.com … can't establish
a connection` or `forbidden header Origin` when using a Puter feature, that is
the SDK's socket failing (tracking protection, adblocker, VPN, offline) — the
app keeps working on seed data. Allow `api.puter.com` / `js.puter.com` in your
blocker to clear it.

## Development server

To start a local development server, run:

```bash
bun run dev
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
bun run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
bun run test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
