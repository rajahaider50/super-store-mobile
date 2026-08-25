# Super Store Mobile — Complete Source

This archive contains the complete source for the Super Store Mobile offline-first e-commerce PWA. It is a React 19 + Vite + Tailwind 4 static frontend designed for GitHub Pages and mobile browsers with an Android-native visual language.

## Run locally

Use Node.js 20 or newer, then run:

```bash
pnpm install
pnpm dev
```

The production checks are:

```bash
pnpm check
pnpm build
```

## Admin demo

Open **Account → Admin workspace**.

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `superstore` |

The catalog, categories, cart, orders, settings, and imported images are saved in this browser's localStorage. Use **Admin → Settings → Export JSON backup** before moving to another browser or device.

## GitHub Pages

Build the project and publish the generated static output through your GitHub Pages workflow. If the repository is hosted under a subpath, configure the Vite `base` option for that repository path before building. The app includes `manifest.json` and `sw.js` for installable PWA behavior and app-shell caching.

## Static hosting boundary

GitHub Pages cannot provide server-side authentication, secure shared admin sessions, cloud database storage, cross-device synchronization, real payment processing, or protected image uploads. This version intentionally provides a working device-local admin experience instead of presenting client-side credentials as secure multi-user authentication. Shopify or a backend service can be connected in a future version for those capabilities.

## Archive contents

The archive includes the `client/` source, public PWA files, reusable UI components, configuration files, package lockfile, design direction in `ideas.md`, this setup guide, and the project metadata. Build output, dependency folders, caches, logs, and generated temporary files are intentionally excluded.
