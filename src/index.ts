import type { Plugin } from 'vite'
import { execSync } from 'node:child_process'

const VIRTUAL_MODULE_ID = 'virtual:commit-info'
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`

/**
 * Get commit hash at build time.
 *
 * Used to identify the deployed version.
 *
 * Retrieval:
 * - CI: from COMMIT_HASH env var (set by GitHub Actions, etc.)
 * - Local: from git command
 * - Failure: returns 'unknown'
 */
function getCommitHash(): string {
  if (process.env.COMMIT_HASH) {
    return process.env.COMMIT_HASH
  }

  try {
    return execSync('git rev-parse HEAD').toString().trim()
  }
  catch {
    return 'unknown'
  }
}

/**
 * Get commit date at build time as UNIX timestamp.
 *
 * Returns number for frontend date formatting flexibility.
 *
 * Retrieval:
 * - CI: from COMMIT_DATE env var (set by GitHub Actions, etc.)
 * - Local: from git command
 * - Failure: returns '0' (handled as unknown on frontend)
 */
function getCommitDate(): string {
  if (process.env.COMMIT_DATE) {
    return process.env.COMMIT_DATE
  }

  try {
    return execSync('git show -s --format=%ct HEAD').toString().trim()
  }
  catch {
    return '0'
  }
}

/**
 * Vite plugin that provides commit info as a virtual module.
 *
 * Retrieves commit hash and date at build time,
 * making them importable from `virtual:commit-info`.
 *
 * @example
 * ```ts
 * import { commitInfo } from 'virtual:commit-info'
 *
 * console.log(commitInfo.hash) // "abc1234..."
 * console.log(commitInfo.date) // 1705312800
 * ```
 */
export function commitInfoPlugin(): Plugin {
  return {
    name: 'vite-plugin-commit-info',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const hash = getCommitHash()
        const date = getCommitDate()
        return `export const commitInfo = {
  hash: ${JSON.stringify(hash)},
  date: ${Number(date)},
};`
      }
    },
  }
}
