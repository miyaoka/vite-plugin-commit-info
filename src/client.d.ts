/**
 * Type definition for virtual:commit-info module.
 *
 * Add to tsconfig.json:
 * ```json
 * {
 *   "compilerOptions": {
 *     "types": ["@miyaoka/vite-plugin-commit-info/client"]
 *   }
 * }
 * ```
 *
 * Or add to env.d.ts:
 * ```ts
 * /// <reference types="@miyaoka/vite-plugin-commit-info/client" />
 * ```
 */
declare module 'virtual:commit-info' {
  export const commitInfo: {
    /** Commit hash at build time */
    hash: string
    /** Commit date at build time (UNIX timestamp) */
    date: number
  }
}
