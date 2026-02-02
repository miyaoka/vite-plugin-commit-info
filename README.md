# @miyaoka/vite-plugin-commit-info

[![npm version](https://img.shields.io/npm/v/@miyaoka/vite-plugin-commit-info)](https://www.npmjs.com/package/@miyaoka/vite-plugin-commit-info)
[![npm downloads](https://img.shields.io/npm/dm/@miyaoka/vite-plugin-commit-info)](https://www.npmjs.com/package/@miyaoka/vite-plugin-commit-info)
[![license](https://img.shields.io/npm/l/@miyaoka/vite-plugin-commit-info)](https://github.com/miyaoka/vite-plugin-commit-info/blob/main/LICENSE)

Vite plugin to provide commit info as a virtual module.

Retrieve commit hash and date at build time to identify deployed versions.

## Install

```bash
pnpm add -D @miyaoka/vite-plugin-commit-info
```

## Usage

```ts
// vite.config.ts
import { commitInfoPlugin } from '@miyaoka/vite-plugin-commit-info'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [commitInfoPlugin()],
})
```

```ts
// In your app
import { commitInfo } from 'virtual:commit-info'

console.log(commitInfo.hash) // "abc1234..."
console.log(commitInfo.date) // 1705312800 (UNIX timestamp)
```

## TypeScript

Add type support by one of these methods:

**Option 1: tsconfig.json**

```json
{
  "compilerOptions": {
    "types": ["@miyaoka/vite-plugin-commit-info/client"]
  }
}
```

**Option 2: env.d.ts**

```ts
/// <reference types="@miyaoka/vite-plugin-commit-info/client" />
```

## CI Environment

In CI environments (e.g., Docker builds without `.git` directory), set these environment variables:

```bash
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_DATE=$(git show -s --format=%ct HEAD)
```

Example GitHub Actions:

```yaml
- name: Build
  run: pnpm build
  env:
    COMMIT_HASH: ${{ github.sha }}
    COMMIT_DATE: ${{ github.event.head_commit.timestamp }}
```

## Why use this plugin?

Compared to generating a file in a prebuild script:

- **No missed execution**: Integrated into the build process, always runs
- **Always fresh**: Retrieves info on every build, no stale data
- **No file management**: Virtual module, no intermediate files to manage

## License

MIT
