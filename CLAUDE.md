# CLAUDE.md

## Overview

Vite plugin that provides commit info (hash, date) as a virtual module `virtual:commit-info`.

## Commands

```bash
pnpm install    # Install dependencies
pnpm build      # Build
pnpm dev        # Build in watch mode
pnpm test:run   # Run tests
```

## Structure

- `src/index.ts` - Plugin implementation
- `src/client.d.ts` - Type definition for virtual module
- `tsdown.config.ts` - Build configuration
- `dist/` - Build output (ESM + CJS)

## How it works

- Provides `virtual:commit-info` virtual module
- Retrieves commit hash via `git rev-parse HEAD`
- Retrieves commit date via `git show -s --format=%ct HEAD`
- Falls back to env vars `COMMIT_HASH` / `COMMIT_DATE` for CI environments
- Returns `unknown` / `0` on failure

## Release

```bash
pnpm build
npm publish
```
